import { readStory } from './dependencies-lookup/readAsObject';
import { getRidOfUselessFilePrefixes } from './dependencies-lookup/getRidOfUselessFilePrefixes';

export function insertAfterImports(insert, source) {
  let start = source.lastIndexOf('\nimport ');
  if (start === -1) {
    start = 0;
  } else {
    start = 1 + source.indexOf('\n', start + 1);
  }
  const imports = source.slice(0, start);
  const rest = source.slice(start);
  return `${imports}${insert}${rest}`;
}

export function transform(inputSource) {
  return readStory(this, inputSource)
    .then(getRidOfUselessFilePrefixes)
    .then(
      ({
        prefix,
        resource,
        source,
        sourceJson,
        addsMap,
        dependencies,
        localDependencies,
        idsToFrameworks,
      }) => {
        const preamble = `
// @ts-ignore
var withSourceLoader = require('@storybook/source-loader/preview').withSource;
// @ts-ignore
var addSourceDecorator = require("@storybook/source-loader/preview").addSource;
// @ts-ignore
var __SOURCE_PREFIX__ = "${prefix.replace(/\\([^\\ ])/g, '\\\\$1')}";
// @ts-ignore
var __STORY__ = ${sourceJson};
// @ts-ignore
var __ADDS_MAP__ = ${JSON.stringify(addsMap)};
// @ts-ignore
var __MAIN_FILE_LOCATION__ = ${JSON.stringify(resource)};
// @ts-ignore
var __MODULE_DEPENDENCIES__ = ${JSON.stringify(dependencies)};
// @ts-ignore
var __LOCAL_DEPENDENCIES__ = ${JSON.stringify(localDependencies)};
// @ts-ignore
var __IDS_TO_FRAMEWORKS__ = ${JSON.stringify(idsToFrameworks)};
        `;
        const annotated = insertAfterImports(preamble, source);
        return annotated;
      }
    );
}
