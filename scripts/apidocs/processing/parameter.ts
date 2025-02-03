import type {
  JSDoc,
  JSDocTag,
  ParameterDeclaration,
  PropertySignature,
  Symbol,
  Type,
  TypeParameterDeclaration,
} from 'ts-morph';
import { exactlyOne, valueForKey } from '../utils/value-checks';
import { newProcessingError } from './error';
import {
  getDefault,
  getDeprecated,
  getDescription,
  getJsDocs,
  getParameterTags,
  getTypeParameterTags,
} from './jsdocs';
import type { RawApiDocsType } from './type';
import { getNameSuffix, getTypeText, isOptionsLikeType } from './type';

/**
 * Represents a parameter in the raw API docs.
 */
export interface RawApiDocsParameter {
  /**
   * The name of the parameter.
   */
  name: string;
  /**
   * The type of the parameter.
   */
  type: RawApiDocsType;
  /**
   * The default value or expression of the parameter, if it has one.
   */
  default: string | undefined;
  /**
   * The description of the parameter.
   */
  description: string;
}

export function processTypeParameters(
  parameters: TypeParameterDeclaration[],
  jsdocs: JSDoc
): RawApiDocsParameter[] {
  const paramTags = getTypeParameterTags(jsdocs);

  return parameters.flatMap((parameter) => {
    try {
      return processTypeParameterEntry(parameter, paramTags);
    } catch (error) {
      throw newProcessingError({
        type: 'type parameter',
        name: parameter.getName(),
        source: parameter,
        cause: error,
      });
    }
  });
}

function processTypeParameterEntry(
  parameter: TypeParameterDeclaration,
  paramTags: Record<string, JSDocTag>
): RawApiDocsParameter {
  return {
    name: `<${parameter.getName()}>`,
    type: getTypeText(parameter.getType(), { resolveAliases: true }),
    default: parameter.getDefault()?.getText(),
    description: getDescription(valueForKey(paramTags, parameter.getName())),
  };
}

export function processParameters(
  signatureParameters: ParameterDeclaration[],
  implParameters: ParameterDeclaration[],
  jsdocs: JSDoc
): RawApiDocsParameter[] {
  const paramTags = getParameterTags(jsdocs);
  const implParameterDefaults = Object.fromEntries(
    implParameters.map((parameter) => [
      parameter.getName(),
      getDefaultValue(parameter),
    ])
  );

  return signatureParameters.flatMap((parameter) => {
    try {
      return processParameter(
        parameter,
        paramTags,
        implParameterDefaults[parameter.getName()]
      );
    } catch (error) {
      throw newProcessingError({
        type: 'parameter',
        name: parameter.getName(),
        source: parameter,
        cause: error,
      });
    }
  });
}

function processParameter(
  parameter: ParameterDeclaration,
  paramTags: Record<string, JSDocTag>,
  implementationDefault: string | undefined
): RawApiDocsParameter[] {
  const name = parameter.getName();
  return [
    processSimpleParameter(
      parameter,
      valueForKey(paramTags, name),
      implementationDefault
    ),
    ...processComplexParameter(name, parameter.getType()),
  ];
}

type ParameterLikeDeclaration = Pick<
  ParameterDeclaration,
  'getName' | 'getType'
> &
  Partial<Pick<ParameterDeclaration, 'getInitializer'>>;

function processSimpleParameter(
  parameter: ParameterLikeDeclaration,
  jsdocTag: JSDocTag,
  implementationDefault: string | undefined
): RawApiDocsParameter {
  const name = parameter.getName();
  const type = parameter.getType();
  return {
    name: `${name}${getNameSuffix(type)}`,
    type: getTypeText(type, {
      abbreviate: true,
      stripUndefined: true,
    }),
    default: getDefaultValue(parameter) ?? implementationDefault,
    description: getDescription(jsdocTag),
  };
}

function getDefaultValue(
  parameter: ParameterLikeDeclaration
): string | undefined {
  return parameter
    .getInitializer?.()
    ?.getText()
    .replace(/ as .+$/, '');
}

function processComplexParameter(
  name: string,
  type: Type
): RawApiDocsParameter[] {
  if (type.isNullable()) {
    return processComplexParameter(name, type.getNonNullableType());
  } else if (type.isUnion()) {
    return type
      .getUnionTypes()
      .flatMap((unionType) => processComplexParameter(name, unionType));
  } else if (type.isArray()) {
    return processComplexParameter(
      `${name}[]`,
      type.getArrayElementTypeOrThrow()
    );
  } else if (type.isObject()) {
    if (!isOptionsLikeType(type)) {
      return [];
    }

    return type
      .getApparentProperties()
      .flatMap((parameter) => {
        try {
          return processComplexParameterProperty(name, parameter);
        } catch (error) {
          throw newProcessingError({
            type: 'property',
            name: `${name}.${parameter.getName()}`,
            source: parameter.getDeclarations()[0],
            cause: error,
          });
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  return [];
}

function processComplexParameterProperty(name: string, parameter: Symbol) {
  const declaration = exactlyOne(
    parameter.getDeclarations(),
    'property declaration'
  ) as PropertySignature;
  const propertyType = declaration.getType();
  const jsdocs = getJsDocs(declaration);
  const deprecated = getDeprecated(jsdocs);

  return [
    {
      name: `${name}.${parameter.getName()}${getNameSuffix(propertyType)}`,
      type: getTypeText(propertyType, {
        abbreviate: false,
        stripUndefined: true,
      }),
      default: getDefault(jsdocs),
      description:
        getDescription(jsdocs) +
        (deprecated ? `\n\n**DEPRECATED:** ${deprecated}` : ''),
    },
  ];
}
