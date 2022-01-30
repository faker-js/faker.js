import * as TypeDoc from 'typedoc';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { format } from 'prettier';
import options from '../.prettierrc.cjs';
import faker from '../src';

const pathRoot = resolve(__dirname, '..');
const pathDocsDir = resolve(pathRoot, 'docs');
const pathDocsApiPages = resolve(pathDocsDir, '.vitepress', 'api-pages.mjs');
const pathOutputDir = resolve(pathDocsDir, 'api');
const pathOutputJson = resolve(pathOutputDir, 'typedoc.json');

const scriptCommand = 'pnpm run generate:api-docs';

function toBlock(comment?: TypeDoc.Comment): string {
  return (
    (comment?.shortText.trim() || 'Missing') +
    (comment?.text ? '\n\n' + comment.text : '')
  );
}

// https://stackoverflow.com/a/6234804/6897682
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parameterRow(
  name: string,
  type?: string,
  def?: string,
  comment?: TypeDoc.Comment
): string {
  def = def ? `<code>${def}</code>` : '';
  return `<tr>
  <td>${escapeHtml(name)}</td>
  <td>${escapeHtml(type)}</td>
  <td>${def}</td>
  <td>

::: v-pre

${toBlock(comment)}

:::

  </td>
</tr>
`;
}

async function build(): Promise<void> {
  const app = new TypeDoc.Application();

  app.options.addReader(new TypeDoc.TSConfigReader());
  // If you want TypeDoc to load typedoc.json files
  //app.options.addReader(new TypeDoc.TypeDocReader());

  app.bootstrap({
    entryPoints: ['src/index.ts'],
    pretty: true,
    cleanOutputDir: true,
  });

  const project = app.convert();

  if (!project) {
    // Project may not have converted correctly
    return;
  }
  // Useful for analyzing the content
  await app.generateJson(project, pathOutputJson);

  const modules = project
    .getChildrenByKind(TypeDoc.ReflectionKind.Namespace)[0]
    .getChildrenByKind(TypeDoc.ReflectionKind.Class);

  const modulesPages: Array<{ text: string; link: string }> = [];
  modulesPages.push({ text: 'Fake', link: '/api/fake.html' });
  modulesPages.push({ text: 'Localization', link: '/api/localization.html' });

  // Generate module file
  for (const module of modules) {
    const moduleName = module.name.replace('_', '');
    const lowerModuleName =
      moduleName.substring(0, 1).toLowerCase() + moduleName.substring(1);
    console.log(`Processing Module ${moduleName}`);

    modulesPages.push({
      text: moduleName,
      link: `/api/${lowerModuleName}.html`,
    });

    let content = `
      # ${moduleName}

      <!-- This file is automatically generated. -->
      <!-- Run '${scriptCommand}' to update -->

      [[toc]]

      ::: v-pre

      ${toBlock(module.comment)}

      :::

      `.replace(/\n +/g, '\n');

    const methods = module.getChildrenByKind(TypeDoc.ReflectionKind.Method);

    // Generate method section
    for (const method of methods) {
      const methodName = method.name;
      const prettyMethodName =
        methodName.substring(0, 1).toUpperCase() +
        methodName.substring(1).replace(/([A-Z]+)/g, ' $1');
      console.log(`- method ${prettyMethodName}`);
      const signature = method.signatures[0];

      content += `
        ## ${prettyMethodName}

        ::: v-pre

        ${toBlock(signature.comment)}

        :::

        `.replace(/\n +/g, '\n');

      // Generate parameter section
      const typeParameters = signature.typeParameters || [];
      const parameters = signature.parameters || [];
      const signatureTypeParameters: string[] = [];
      const signatureParameters: string[] = [];
      let requiresArgs = false;
      if (typeParameters.length !== 0 || parameters.length !== 0) {
        content += `**Parameters**

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
`;

        // typeParameters
        typeParameters.forEach((parameter, index) => {
          const parameterName = parameter.name;

          signatureTypeParameters.push(parameterName);
          content += parameterRow(
            `<${parameterName}>`,
            '',
            '',
            parameter.comment
          );
        });

        // parameters
        parameters.forEach((parameter, index) => {
          const parameterDefault = parameter.defaultValue;
          const parameterRequired = typeof parameterDefault === 'undefined';
          if (index == 0) {
            requiresArgs = parameterRequired;
          }
          const parameterName = parameter.name + (parameterRequired ? '?' : '');
          const parameterType = parameter.type.toString();

          let parameterDefaultSignatureText = '';
          if (!parameterRequired) {
            parameterDefaultSignatureText = ' = ' + parameterDefault;
          }

          signatureParameters.push(
            parameterName + ': ' + parameterType + parameterDefaultSignatureText
          );
          content += parameterRow(
            parameterName,
            parameterType,
            parameterDefault,
            parameter.comment
          );
        });

        content += `  </tbody>
</table>

`;
      }
      content += '**Returns:** ' + signature.type.toString() + '\n\n';

      // Generate usage section

      content += '````ts\n';

      let signatureTypeParametersString = signatureTypeParameters.join(', ');
      if (signatureTypeParametersString.length !== 0) {
        signatureTypeParametersString = `<${signatureTypeParametersString}>`;
      }
      const signatureParametersString = signatureParameters.join(', ');

      content += `faker.${lowerModuleName}.${methodName}${signatureTypeParametersString}(${signatureParametersString}): ${signature.type.toString()}\n`;
      faker.seed(0);
      if (!requiresArgs) {
        try {
          let example = JSON.stringify(faker[lowerModuleName][methodName]());
          if (example.length > 50) {
            example = example.substring(0, 47) + '...';
          }

          content += `faker.${lowerModuleName}.${methodName}()`;
          content += (example ? ` // => ${example}` : '') + '\n';
        } catch {
          console.log(
            `Failed to call: faker.${lowerModuleName}${methodName}()`
          );
        }
      }
      const examples =
        signature?.comment?.tags
          .filter((tag) => tag.tagName === 'example')
          .map((tag) => tag.text.trimEnd()) || [];

      if (examples.length !== 0) {
        console.log('Example-Length: ' + examples);
        content += examples.join('\n') + '\n';
      }

      content += '````\n\n';
    }

    // Format md

    content = format(content, {
      ...options,
      parser: 'markdown',
    });

    // Write to disk

    writeFileSync(resolve(pathOutputDir, lowerModuleName + '.md'), content);
    console.log(`Done Module ${moduleName}`);
  }

  // Write api-pages.mjs
  modulesPages.sort((a, b) => a.text.localeCompare(b.text));
  let apiPagesContent = `
    // This file is automatically generated.
    // Run '${scriptCommand}' to update
    export const apiPages = ${JSON.stringify(modulesPages)};
    `.replace(/\n +/, '\n');

  apiPagesContent = format(apiPagesContent, {
    ...options,
    parser: 'babel',
  });

  writeFileSync(pathDocsApiPages, apiPagesContent);
  console.log('Updated api-pages.mjs');
}

build().catch(console.error);
