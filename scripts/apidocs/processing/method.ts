import type {
  ClassDeclaration,
  ConstructorDeclaration,
  FunctionDeclaration,
  InterfaceDeclaration,
  MethodDeclaration,
  MethodSignature,
  Project,
} from 'ts-morph';
import { SyntaxKind } from 'ts-morph';
import { groupBy } from '../../../src/internal/group-by';
import { newProcessingError } from './error';
import type {
  RawApiDocsSignature,
  SignatureLikeDeclaration,
} from './signature';
import { processSignatures } from './signature';
import type { RawApiDocsSource } from './source';
import { getSourcePath as getSource } from './source';

/**
 * Represents a  method in the raw API docs.
 */
export interface RawApiDocsMethod {
  /**
   * The name of the method.
   */
  name: string;
  /**
   * The signatures of the method.
   */
  signatures: RawApiDocsSignature[];
  /**
   * The source of the method.
   */
  source: RawApiDocsSource;
}

// Constructors

export function processClassConstructors(
  clazz: ClassDeclaration
): RawApiDocsMethod[] {
  return processConstructors(clazz.getConstructors());
}

function processConstructors(
  constructors: ConstructorDeclaration[]
): RawApiDocsMethod[] {
  return processMethodLikes(constructors, () => 'constructor');
}

// Class Methods

export function processClassMethods(
  clazz: ClassDeclaration
): RawApiDocsMethod[] {
  return processMethods(getAllMethods(clazz));
}

function getAllMethods(clazz: ClassDeclaration): MethodDeclaration[] {
  const parents: ClassDeclaration[] = [clazz];
  let parent: ClassDeclaration | undefined = clazz;
  while ((parent = parent.getBaseClass()) != null) {
    parents.unshift(parent);
  }

  const methods: Record<string, MethodDeclaration> = {};

  for (const parent of parents) {
    for (const method of parent.getMethods()) {
      methods[method.getName()] = method;
    }
  }

  return Object.values(methods).sort((a, b) =>
    a.getName().localeCompare(b.getName())
  );
}

type NamedMethodLikeDeclaration = MethodLikeDeclaration &
  Pick<MethodDeclaration, 'getName'>;

function processMethods(
  methods: NamedMethodLikeDeclaration[]
): RawApiDocsMethod[] {
  return processMethodLikes(methods, (v) => v.getName());
}

// Interface Methods

export function processInterfaceMethods(
  iface: InterfaceDeclaration
): RawApiDocsMethod[] {
  return processMethodSignatures(iface.getMethods());
}

function processMethodSignatures(
  methods: MethodSignature[]
): RawApiDocsMethod[] {
  const groupedSignatures = groupBy(methods, (v) => v.getName());

  const methodLikes: NamedMethodLikeDeclaration[] = Object.values(
    groupedSignatures
  ).map((signatures) => {
    const signature = signatures[0];

    return {
      getName: () => signature.getName(),
      hasModifier: () => false,
      getOverloads: () => signatures,
      getTypeParameters: () => signature.getTypeParameters(),
      getParameters: () => signature.getParameters(),
      getReturnType: () => signature.getReturnType(),
      getJsDocs: () => signature.getJsDocs(),
      getSourceFile: () => signature.getSourceFile(),
      getStart: () => signature.getStart(),
      getText: () => signature.getText(),
    };
  });

  return processMethods(methodLikes);
}

// Functions

function getAllFunctions(
  project: Project
): Record<string, FunctionDeclaration> {
  return Object.fromEntries(
    project
      .getSourceFiles()
      .flatMap((file) => file.getFunctions())
      .map((fn) => [fn.getNameOrThrow(), fn] as const)
  );
}

export function processUtilityFunctions(project: Project): RawApiDocsMethod[] {
  return processMethodLikes(
    Object.values(getAllFunctions(project)).filter((fn) =>
      fn.getSourceFile().getFilePath().includes('/src/utils/')
    ),
    (f) => f.getNameOrThrow()
  );
}

// Method-likes

type MethodLikeDeclaration = SignatureLikeDeclaration &
  Pick<MethodDeclaration, 'hasModifier'> & {
    getOverloads(): SignatureLikeDeclaration[];
  };

function processMethodLikes<T extends MethodLikeDeclaration>(
  methods: T[],
  nameResolver: (value: T) => string
): RawApiDocsMethod[] {
  return methods
    .filter((method) => !method.hasModifier(SyntaxKind.PrivateKeyword))
    .map((method) => {
      const name = nameResolver(method);
      try {
        return processMethodLike(name, method);
      } catch (error) {
        throw newProcessingError({
          type: 'method',
          name,
          source: method,
          cause: error,
        });
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function processMethodLike(
  name: string,
  method: MethodLikeDeclaration
): RawApiDocsMethod {
  console.log(`  - ${name}`);
  const overloads = method.getOverloads();
  const signatureData: SignatureLikeDeclaration[] =
    overloads.length > 0 ? overloads : [method];

  const signatures = processSignatures(name, signatureData, method);
  const source = getSource(method);

  return {
    name,
    signatures,
    source,
  };
}
