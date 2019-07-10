import defaultOptions from './default-options';
import getParser from './parsers';

import {
  generateSourceWithDecorators,
  generateSourceWithoutDecorators,
  generateStorySource,
  generateStoriesLocationsMap,
  generateDependencies,
  generateSourcesInExportedParameters,
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

function inject(source, filepath, options = {}, log = message => {}) {
  const { injectDecorator = true, injectParameters = true, inspectDependencies } = options;
  const obviouslyNotCode = ['md', 'txt', 'json'].includes(options.parser);
  let parser = null;
  try {
    parser = getParser(options.parser);
  } catch (e) {
    log(new Error(`(not fatal, only impacting storysource) Could not load a parser (${e})`));
  }

  if (obviouslyNotCode || !parser) {
    return {
      source,
      storySource: {},
      addsMap: {},
      changed: false,
      dependencies: [],
    };
  }
  const ast = parser.parse(source);

  const { changed, source: cleanedSource, comments, exportTokenFound } =
    injectDecorator === true
      ? generateSourceWithDecorators(source, ast, injectParameters)
      : generateSourceWithoutDecorators(source, ast);

  const storySource = generateStorySource(extendOptions(source, comments, filepath, options));
  const newAst = parser.parse(storySource);
  const { dependencies, storiesOfIdentifiers } = inspectDependencies
    ? generateDependencies(newAst)
    : { dependencies: [], storiesOfIdentifiers: {} };
  const { addsMap, idsToFrameworks } = generateStoriesLocationsMap(newAst, storiesOfIdentifiers);

  let newSource = cleanedSource;
  if (exportTokenFound) {
    const cleanedSourceAst = parser.parse(cleanedSource);
    newSource = generateSourcesInExportedParameters(cleanedSource, cleanedSourceAst, {
      source: storySource,
      locationsMap: addsMap,
    });
  }

  if (!changed && Object.keys(addsMap || {}).length === 0) {
    return {
      source: newSource,
      storySource,
      addsMap: {},
      changed,
      dependencies,
      idsToFrameworks: idsToFrameworks || {},
    };
  }

  return {
    source: newSource,
    storySource,
    addsMap,
    changed,
    dependencies,
    idsToFrameworks: idsToFrameworks || {},
  };
}

export default inject;
