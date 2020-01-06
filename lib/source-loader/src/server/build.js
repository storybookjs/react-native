import { getOptions } from 'loader-utils';
import { readStory } from './dependencies-lookup/readAsObject';
import { getRidOfUselessFilePrefixes } from './dependencies-lookup/getRidOfUselessFilePrefixes';
import getParser from './abstract-syntax-tree/parsers';
import { endOfImports } from './abstract-syntax-tree/traverse-helpers';

export function insertAfterImports(classLoader, insert, source) {
  const options = getOptions(classLoader) || {};
  let ast;
  try {
    ast = getParser(options.parser || classLoader.extension || 'javascript').parse(source);
  } catch (e) {
    // if not working, then we will fallback to not adding anything
    // perhaps the code was not written in javascript
    return source;
  }
  if (!ast) return `${insert}${source}`;
  const endOfImportsIndex = endOfImports(ast);
  const result = `${source.substring(0, endOfImportsIndex)}\n${insert}\n${source.substring(
    endOfImportsIndex
  )}`;
  return result;
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
/* eslint-disable no-unused-vars,@typescript-eslint/no-unused-vars */
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
/* eslint-enable no-unused-vars,@typescript-eslint/no-unused-vars */
        `;
        return insertAfterImports(this, preamble, source);
        // return `${preamble}${source}`;
      }
    );
}
