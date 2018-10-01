export function babel(config) {
  // Ensure plugins are defined or fallback to an array to avoid empty values.
  const babelConfigPlugins = config.plugins || [];

  const extraPlugins = [
    [
      require.resolve('babel-plugin-react-docgen'),
      {
        DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES',
      },
    ],
  ];

  // If `babelConfigPlugins` is not an `Array`, calling `concat` will inject it
  // as a single value, if it is an `Array` it will be spreaded.
  return {
    ...config,
    plugins: [].concat(babelConfigPlugins, extraPlugins),
  };
}
