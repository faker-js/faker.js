import type { JSDoc, JSDocTag, JSDocableNode } from 'ts-morph';
import { JSDocParameterTag, JSDocTemplateTag } from 'ts-morph';
import {
  allRequired,
  exactlyOne,
  optionalOne,
  required,
} from '../utils/value-checks';

export type JSDocableLikeNode = Pick<JSDocableNode, 'getJsDocs'>;

export function getJsDocs(node: JSDocableLikeNode): JSDoc {
  return exactlyOne(
    node.getJsDocs(),
    'jsdocs',
    'Please ensure that each method signature has JSDocs, and that all properties of option/object parameters are documented with both @param tags and inline JSDocs.'
  );
}

export function getDeprecated(jsdocs: JSDoc): string | undefined {
  return getOptionalTagFromJSDoc(jsdocs, 'deprecated');
}

export function getDescription(jsdocs: JSDoc | JSDocTag): string {
  return required(jsdocs.getCommentText(), 'jsdocs description');
}

export function getSince(jsdocs: JSDoc): string {
  return getExactlyOneTagFromJSDoc(jsdocs, 'since');
}

export function getTypeParameterTags(jsdocs: JSDoc): Record<string, JSDocTag> {
  return Object.fromEntries(
    jsdocs
      .getTags()
      .filter((tag) => tag.getTagName() === 'template')
      .filter((tag) => tag instanceof JSDocTemplateTag)
      .map((tag) => [tag.getTypeParameters()[0].getName(), tag] as const)
  );
}

export function getParameterTags(jsdocs: JSDoc): Record<string, JSDocTag> {
  return Object.fromEntries(
    jsdocs
      .getTags()
      .filter((tag) => tag.getTagName() === 'param')
      .filter((tag) => tag instanceof JSDocParameterTag)
      .map((tag) => [tag.getName(), tag] as const)
  );
}

export function getDefault(jsdocs: JSDoc): string | undefined {
  return (
    getOptionalTagFromJSDoc(jsdocs, `default`)
      // Prevent line breaks between the key and the value { foo: 'bar' }
      ?.replaceAll(': ', ': ')
  );
}

export function getThrows(jsdocs: JSDoc): string[] {
  return getTagsFromJSDoc(jsdocs, 'throws');
}

export function getExamples(jsdocs: JSDoc): string[] {
  return getTagsFromJSDoc(jsdocs, 'example');
}

export function getSeeAlsos(jsdocs: JSDoc): string[] {
  return getTagsFromJSDoc(jsdocs, 'see', true);
}

function getOptionalTagFromJSDoc(
  jsdocs: JSDoc,
  type: string
): string | undefined {
  return optionalOne(getTagsFromJSDoc(jsdocs, type), `@${type}`);
}

function getExactlyOneTagFromJSDoc(jsdocs: JSDoc, type: string): string {
  return exactlyOne(getTagsFromJSDoc(jsdocs, type), `@${type}`);
}

function getTagsFromJSDoc(
  jsdocs: JSDoc,
  type: string,
  full: boolean = false
): string[] {
  return allRequired(
    jsdocs
      .getTags()
      .filter((tag) => tag.getTagName() === type)
      .map((tag) =>
        full ? tag.getStructure().text?.toString() : tag.getCommentText()
      ),
    `@${type}`
  );
}
