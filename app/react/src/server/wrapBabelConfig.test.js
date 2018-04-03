import wrapBabelConfig from './wrapBabelConfig';

describe('babel_config', () => {
  const babelPluginReactDocgenPath = require.resolve('babel-plugin-react-docgen');

  it('should return the config with the extra plugins when `plugins` is an array.', () => {
    const babelConfig = {
      babelrc: false,
      presets: ['env', 'foo-preset'],
      plugins: ['foo-plugin'],
    };

    const config = wrapBabelConfig(babelConfig);

    expect(config).toEqual({
      babelrc: false,
      plugins: [
        'foo-plugin',
        [
          babelPluginReactDocgenPath,
          {
            DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES',
          },
        ],
      ],
      presets: ['env', 'foo-preset'],
    });
  });

  it('should return the config with the extra plugins when `plugins` is not an array.', () => {
    const babelConfig = {
      babelrc: false,
      presets: ['env', 'foo-preset'],
      plugins: 'bar-plugin',
    };

    const config = wrapBabelConfig(babelConfig);

    expect(config).toEqual({
      babelrc: false,
      plugins: [
        'bar-plugin',
        [
          babelPluginReactDocgenPath,
          {
            DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES',
          },
        ],
      ],
      presets: ['env', 'foo-preset'],
    });
  });

  it('should return the config only with the extra plugins when `plugins` is not present.', () => {
    const babelConfig = {
      babelrc: false,
      presets: ['env', 'foo-preset'],
    };

    const config = wrapBabelConfig(babelConfig);

    expect(config).toEqual({
      babelrc: false,
      plugins: [
        [
          babelPluginReactDocgenPath,
          {
            DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES',
          },
        ],
      ],
      presets: ['env', 'foo-preset'],
    });
  });
});
