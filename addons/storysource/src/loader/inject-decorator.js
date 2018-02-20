import {
  generateSourceWithDecorators,
  generateStorySource,
  generateAddsMap,
} from './generate-helpers';

function inject(source, decorator) {
  const { changed, source: newSource, comments } = generateSourceWithDecorators(source, decorator);

  if (!changed) {
    return {
      source: newSource,
      addsMap: {},
      changed,
    };
  }

  const storySource = generateStorySource({ source, comments });
  const addsMap = generateAddsMap(storySource);

  return {
    source: newSource,
    storySource,
    addsMap,
    changed,
  };
}

export default inject;
