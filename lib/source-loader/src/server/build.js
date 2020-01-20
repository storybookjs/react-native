import { readStory } from './dependencies-lookup/readAsObject';
import { getRidOfUselessFilePrefixes } from './dependencies-lookup/getRidOfUselessFilePrefixes';

export function transform(inputSource) {
  return readStory(this, inputSource)
    .then(sourceObject => {
      // if source-loader had trouble parsing the story exports, return the original story
      // example is
      // const myStory = () => xxx
      // export { myStory }
      if (!sourceObject.source || sourceObject.source.length === 0) {
        return { source: inputSource };
      }
      return getRidOfUselessFilePrefixes(sourceObject);
    })
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
        const preamble = prefix
          ? `
/* eslint-disable */
// @ts-nocheck
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
        `
          : '';
        return `${preamble}\n${source}`;
      }
    );
}
