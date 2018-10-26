import findCacheDir from 'find-cache-dir';

const extend = babelConfig => ({
  // This is a feature of `babel-loader` for webpack (not Babel itself).
  // It enables a cache directory for faster-rebuilds
  // `find-cache-dir` will create the cache directory under the node_modules directory.
  cacheDirectory: findCacheDir({ name: 'storybook' }),
  ...babelConfig,
});

export { extend as babel, extend as managerBabel };
