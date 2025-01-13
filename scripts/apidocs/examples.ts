import { mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { ClassDeclaration, MethodDeclaration } from 'ts-morph';
import { formatResult } from '../../docs/.vitepress/components/api-docs/format';
import * as globalFaker from '../../src';
import { groupBy } from '../../src/internal/group-by';
import { prepareExampleCapturing } from './output/page';
import { findModuleClasses, findProjectClasses } from './processing/class';
import { getExamples, getJsDocs, getTagsFromJSDoc } from './processing/jsdocs';
import { isApiMethod } from './processing/method';
import type { SignatureLikeDeclaration } from './processing/signature';
import { getProject } from './project';
import { FILE_PATH_PROJECT } from './utils/paths';

const tempDir = resolve(FILE_PATH_PROJECT, 'script/temp');
let i = 0;

Object.assign(globalThis, globalFaker);

export async function refreshExamples(): Promise<void> {
  console.log('Reading project');
  const project = getProject();
  const classes = [
    ...findProjectClasses(project),
    ...findModuleClasses(project),
  ];
  const classesByFile = groupBy(classes, (clazz) =>
    clazz.getSourceFile().getFilePath()
  );

  await mkdir(tempDir, { recursive: true });

  console.log('Processing...');
  for (const classes of Object.values(classesByFile)) {
    for (const clazz of classes) {
      console.log(`- ${clazz.getName()}`);
      await processClass(clazz);
    }

    await classes[0].getSourceFile().save();
  }

  await rm(tempDir, { recursive: true });

  console.log('Completed');
  console.log('Remember to check the changes before committing');
}

async function processClass(clazz: ClassDeclaration) {
  const methods = clazz.getMethods().filter(isApiMethod);
  for (const method of methods) {
    await processMethod(method);
  }

  const baseClass = clazz.getBaseClass();
  if (baseClass != null) {
    await processClass(baseClass);
  }
}

async function processMethod(method: MethodDeclaration) {
  console.log(`  - ${method.getName()}`);
  const overloads = method.getOverloads();
  const signatures: SignatureLikeDeclaration[] =
    overloads.length > 0 ? overloads : [method];
  for (const [index, signature] of Object.entries(signatures)) {
    await processSignature(index, signature);
  }
}

async function processSignature(
  index: string,
  signature: SignatureLikeDeclaration
) {
  const jsdocs = getJsDocs(signature);
  const exampleTags = getTagsFromJSDoc(jsdocs, 'example');
  const exampleTag = exampleTags[0];
  if (exampleTags.length === 0) {
    console.log('No examples found');
    return;
  } else if (exampleTags.length > 1) {
    console.error('Multiple examples found');
    return;
  }

  const exampleCode = getExamples(jsdocs).join('\n');
  const exampleLines = exampleCode.split('\n');

  const captureCode = prepareExampleCapturing({
    main: exampleCode,
    async: false,
    init: [
      'faker.seed(0);',
      'faker.setDefaultRefDate(new Date(2025, 0, 1));',
      ...(exampleCode.match(/^(faker[A-Z]\w+)\./gm) ?? []).map(
        (match) => `${match}seed(0);`
      ),
    ],
  });

  const tempFilePath = resolve(tempDir, `example-${i++}.ts`);
  await writeFile(tempFilePath, `export const fn = ${captureCode}`);

  const { fn } = (await import(`file://${tempFilePath}`)) as {
    fn: () => unknown[];
  };
  const result = fn();
  let lineIndex = 0;
  let resultIndex = 0;
  while (lineIndex < exampleLines.length && resultIndex < result.length) {
    // Skip empty and preparatory lines (no '^faker.' invocation)
    if (!/^\w*faker\w*\./i.test(exampleLines[lineIndex])) {
      lineIndex++;
      continue;
    }

    // Skip to end of the invocation (if multiline)
    while (
      lineIndex < exampleLines.length &&
      !/^([^ ].*)?\)(\.\w+)?;? ?(\/\/|$)/.test(exampleLines[lineIndex])
    ) {
      lineIndex++;
    }

    if (lineIndex >= exampleLines.length) {
      break;
    }

    // Purge old results
    if (exampleLines[lineIndex].includes('//')) {
      // Inline comments
      exampleLines[lineIndex] = exampleLines[lineIndex].replace(/ ?\/\/.*/, '');
    } else {
      // Multiline comments
      while (exampleLines[lineIndex + 1]?.trimStart().startsWith('//')) {
        exampleLines.splice(lineIndex + 1, 1);
      }
    }

    // Insert new results
    const prettyResult = formatResult(result[resultIndex++]);
    const resultLines = prettyResult.split('\\n');
    if (resultLines.length === 1) {
      exampleLines[lineIndex] = `${exampleLines[lineIndex]} // ${prettyResult}`;
    } else {
      exampleLines.splice(
        lineIndex + 1,
        0,
        ...resultLines.map((line) => `// ${line}`)
      );
    }

    lineIndex += resultLines.length;
  }

  // Update jsdoc
  exampleLines.unshift('@example');
  exampleTag.replaceWithText(exampleLines.join('\n * '));
}
