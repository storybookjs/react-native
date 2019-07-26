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
  var withSourceLoader = require('@storybook/source-loader/preview').withSource;
  var __SOURCE_PREFIX__ = "${prefix.replace(/\\([^\\ ])/g, '\\\\$1')}";
  var __STORY__ = ${sourceJson};
  var __ADDS_MAP__ = ${JSON.stringify(addsMap)};
  var __MAIN_FILE_LOCATION__ = ${JSON.stringify(resource)};
  var __MODULE_DEPENDENCIES__ = ${JSON.stringify(dependencies)};
  var __LOCAL_DEPENDENCIES__ = ${JSON.stringify(localDependencies)};
  var __IDS_TO_FRAMEWORKS__ = ${JSON.stringify(idsToFrameworks)};

  ${source}
  `
    );
}
