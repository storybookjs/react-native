import findCacheDir from 'find-cache-dir';

function extendBabel(babelConfig) {
  return {
    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables a cache directory for faster-rebuilds
    // `find-cache-dir` will create the cache directory under the node_modules directory.
    cacheDirectory: findCacheDir({ name: 'react-storybook' }),
    ...babelConfig,
  };
}

export default {
  extendBabel,
};
