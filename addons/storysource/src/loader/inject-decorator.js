import defaultOptions from './default-options';

import {
  generateSourceWithDecorators,
  generateSourceWithoutDecorators,
  generateStorySource,
  generateAddsMap,
} from './generate-helpers';

function extendOptions(source, comments, filepath, options) {
  return {
    ...defaultOptions,
    ...options,
    source,
    comments,
    filepath,
  };
}

function inject(source, decorator, filepath, options = {}) {
  const { injectDecorator = true } = options;
  const { changed, source: newSource, comments } =
    injectDecorator === true
      ? generateSourceWithDecorators(source, decorator, options.parser)
      : generateSourceWithoutDecorators(source, options.parser);

  if (!changed) {
    return {
      source: newSource,
      addsMap: {},
      changed,
    };
  }

  const storySource = generateStorySource(extendOptions(source, comments, filepath, options));
  const addsMap = generateAddsMap(storySource, options.parser);

  return {
    source: newSource,
    storySource,
    addsMap,
    changed,
  };
}

export default inject;
