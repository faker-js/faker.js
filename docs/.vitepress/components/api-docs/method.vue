<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { sourceBaseUrl } from '../../../api/source-base-url';
import { slugify } from '../../shared/utils/slugify';
import { formatResult } from './format';
import type { ApiDocsMethod } from './method';
import MethodParameters from './method-parameters.vue';
import RefreshButton from './refresh-button.vue';

const { method } = defineProps<{ method: ApiDocsMethod }>();
const {
  deprecated,
  description,
  since,
  parameters,
  returns,
  throws,
  signature,
  examples,
  refresh,
  seeAlsos,
  sourcePath,
} = method;

const code = useTemplateRef('code');
const codeBlock = computed(() => code.value?.querySelector('div pre code'));
const codeLines = ref<Element[]>();

function initRefresh(): Element[] {
  if (codeBlock.value == null) {
    return [];
  }
  const domLines = codeBlock.value.querySelectorAll('.line');
  let lineIndex = 0;
  const result: Element[] = [];
  while (lineIndex < domLines.length) {
    // Skip empty and preparatory lines (no '^faker.' invocation)
    if (
      domLines[lineIndex]?.children.length === 0 ||
      !/^\w*faker\w*\./i.test(domLines[lineIndex]?.textContent ?? '')
    ) {
      lineIndex++;
      continue;
    }

    // Skip to end of the invocation (if multiline)
    while (
      domLines[lineIndex] != null &&
      !/^([^ ].*)?\)(\.\w+)?;? ?(\/\/|$)/.test(
        domLines[lineIndex]?.textContent ?? ''
      )
    ) {
      lineIndex++;
    }

    if (lineIndex >= domLines.length) {
      break;
    }

    const domLine = domLines[lineIndex];
    result.push(domLine);
    lineIndex++;

    // Purge old results
    if (domLine.lastElementChild?.textContent?.startsWith('//')) {
      // Inline comments
      domLine.lastElementChild.remove();
    } else {
      // Multiline comments
      while (domLines[lineIndex]?.children[0]?.textContent?.startsWith('//')) {
        domLines[lineIndex].previousSibling?.remove(); // newline
        domLines[lineIndex].remove(); // comment
        lineIndex++;
      }
    }

    // Add space between invocation and comment (if missing)
    const lastElementChild = domLine.lastElementChild;
    if (
      lastElementChild != null &&
      !lastElementChild.textContent?.endsWith(' ')
    ) {
      lastElementChild.textContent += ' ';
    }
  }

  return result;
}

async function onRefresh(): Promise<void> {
  if (refresh != null && codeBlock.value != null) {
    codeLines.value ??= initRefresh();

    const results = await refresh();

    // Remove old comments
    codeBlock.value
      .querySelectorAll('.comment-delete-marker')
      .forEach((el) => el.remove());

    // Insert new comments
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const domLine = codeLines.value[i];
      const prettyResult = formatResult(result);
      const resultLines = prettyResult.split('\\n');

      if (resultLines.length === 1) {
        domLine.insertAdjacentHTML('beforeend', newCommentSpan(resultLines[0]));
      } else {
        for (const line of resultLines.reverse()) {
          domLine.insertAdjacentHTML('afterend', newCommentLine(line));
        }
      }
    }
  }
}

function newCommentLine(content: string): string {
  return `<span class="line comment-delete-marker">\n${newCommentSpan(content)}</span>`;
}

function newCommentSpan(content: string): string {
  return `<span class="comment-delete-marker" style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// ${content}</span>`;
}

function seeAlsoToUrl(see: string): string {
  const [, module, methodName] = see.replace(/\(.*/, '').split('\.');

  if (!methodName) {
    return `faker.html#${slugify(module)}`;
  }

  return `${module}.html#${slugify(methodName)}`;
}
</script>

<template>
  <div>
    <div v-if="deprecated" class="warning custom-block">
      <p class="custom-block-title">Deprecated</p>
      <p>This method is deprecated and will be removed in a future version.</p>
      <span v-html="deprecated" />
    </div>

    <div v-html="description"></div>

    <p v-if="since">
      <em>Available since v{{ since }}</em>
    </p>

    <MethodParameters v-if="parameters.length > 0" :parameters="parameters" />

    <p><strong>Returns:</strong> {{ returns }}</p>

    <p v-if="throws"><strong>Throws:</strong> <span v-html="throws" /></p>

    <div v-html="signature" />

    <h3 class="inline">Examples</h3>
    <RefreshButton
      class="refresh"
      v-if="refresh != null"
      style="margin-left: 0.5em"
      :refresh="onRefresh"
    />
    <div ref="code" v-html="examples" />

    <div v-if="seeAlsos.length > 0">
      <h3>See Also</h3>
      <ul>
        <li v-for="seeAlso of seeAlsos" :key="seeAlso">
          <a
            v-if="seeAlso.startsWith('faker.')"
            :href="seeAlsoToUrl(seeAlso)"
            v-html="seeAlso"
          />
          <div v-else v-html="seeAlso" />
        </li>
      </ul>
    </div>

    <div v-if="sourcePath">
      <h3>Source</h3>
      <ul>
        <li>
          <a
            :href="sourceBaseUrl + sourcePath"
            target="_blank"
            class="source-link"
          >
            View Source
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="1.2em"
              height="1.2em"
              class="source-link-icon"
            >
              <path
                d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
              />
            </svg>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
a.source-link {
  display: flex;
  align-items: center;
}

svg.source-link-icon {
  display: inline;
  margin-left: 0.3em;
}

h3.inline {
  display: inline-block;
}
</style>
