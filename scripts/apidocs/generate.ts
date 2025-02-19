import type { Project } from 'ts-morph';
import { writeDiffIndex } from './output/diff-index';
import { writePages } from './output/page';
import { writePageIndex } from './output/page-index';
import { writeSearchIndex } from './output/search-index';
import { writeSourceBaseUrl } from './output/source-base-url';
import type { RawApiDocsPage } from './processing/class';
import {
  processModuleClasses,
  processProjectClasses,
  processProjectDistributors,
  processProjectInterfaces,
  processProjectUtilities,
} from './processing/class';
import { getProject } from './project';

export async function generate(): Promise<void> {
  console.log('Reading project');
  const project = getProject();
  console.log('Processing components');
  const apiDocsPages = processComponents(project);
  console.log('Writing files');
  await writeFiles(apiDocsPages);
}

export function processComponents(project: Project): RawApiDocsPage[] {
  return [
    ...processProjectClasses(project),
    ...processProjectInterfaces(project),
    processProjectDistributors(project),
    processProjectUtilities(project),
    ...processModuleClasses(project),
  ];
}

async function writeFiles(apiDocsPages: RawApiDocsPage[]): Promise<void> {
  console.log('- diff index');
  writeDiffIndex(apiDocsPages);
  console.log('- page index');
  await writePageIndex(apiDocsPages);
  console.log('- pages');
  await writePages(apiDocsPages);
  console.log('- search index');
  writeSearchIndex(apiDocsPages);
  console.log('- source base url');
  await writeSourceBaseUrl();
}
