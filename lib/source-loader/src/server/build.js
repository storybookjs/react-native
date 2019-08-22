import { readStory } from './dependencies-lookup/readAsObject';
import { getRidOfUselessFilePrefixes } from './dependencies-lookup/getRidOfUselessFilePrefixes';

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
      }) => `
  // @ts-ignore
  var withSourceLoader = require('@storybook/source-loader/preview').withSource;
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

  ${source}
  `
    );
}
