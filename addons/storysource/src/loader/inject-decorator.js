import defaultOptions from './default-options';

import {
  generateSourceWithDecorators,
  generateStorySource,
  generateAddsMap,
} from './generate-helpers';

function extendOptions(source, comments, options) {
  return {
    ...defaultOptions,
    ...options,
    source,
    comments,
  };
}

function inject(source, decorator, options = {}) {
  const { changed, source: newSource, comments } = generateSourceWithDecorators(source, decorator);

  if (!changed) {
    return {
      source: newSource,
      addsMap: {},
      changed,
    };
  }

  const storySource = generateStorySource(extendOptions(source, comments, options));
  const addsMap = generateAddsMap(storySource);

  return {
    source: newSource,
    storySource,
    addsMap,
    changed,
  };
}

export default inject;
