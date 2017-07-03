import mock from 'mock-fs';
import loadBabelConfig from './babel_config';

describe('babel_config', () => {
  // As the 'fs' is going to be mocked, let's call require.resolve
  // so the require.cache has the correct route to the file.
  // In fact let's use it in the tests :)
  const babelPluginReactDocgenPath = require.resolve('babel-plugin-react-docgen');

  it('should return the config with the extra plugins when `plugins` is an array.', () => {
    // Mock a simple `.babelrc` config file.
    mock({
      '.babelrc': `{
        "presets": [
          "es2015",
          "foo-preset"
        ],
        "plugins": [
          "foo-plugin"
        ]
      }`,
    });

    const config = loadBabelConfig('.foo');

    expect(config.plugins).toEqual([
      'foo-plugin',
      [
        babelPluginReactDocgenPath,
        {
          DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES',
        },
      ],
    ]);

    mock.restore();
  });

  it('should return the config with the extra plugins when `plugins` is not an array.', () => {
    // Mock a `.babelrc` config file with plugins key not being an array.
    mock({
      '.babelrc': `{
        "presets": [
          "es2015",
          "foo-preset"
        ],
        "plugins": "bar-plugin"
      }`,
    });

    const config = loadBabelConfig('.bar');

    expect(config.plugins).toEqual([
      'bar-plugin',
      [
        babelPluginReactDocgenPath,
        {
          DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES',
        },
      ],
    ]);

    mock.restore();
  });

  it('should return the config only with the extra plugins when `plugins` is not present.', () => {
    // Mock a `.babelrc` config file with no plugins key.
    mock({
      '.babelrc': `{
        "presets": [
          "es2015",
          "foo-preset"
        ]
      }`,
    });

    const config = loadBabelConfig('.biz');

    expect(config.plugins).toEqual([
      [
        babelPluginReactDocgenPath,
        {
          DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES',
        },
      ],
    ]);

    mock.restore();
  });
});
