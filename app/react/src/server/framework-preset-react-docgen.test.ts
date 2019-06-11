import { TransformOptions } from '@babel/core';
import * as preset from './framework-preset-react-docgen';

describe('framework-preset-react-docgen', () => {
  const babelPluginReactDocgenPath = require.resolve('babel-plugin-react-docgen');

  it('should return the config with the extra plugins when `plugins` is an array.', () => {
    const babelConfig = {
      babelrc: false,
      presets: ['env', 'foo-preset'],
      plugins: ['foo-plugin'],
    };

    const config = preset.babel(babelConfig);

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
    const babelConfig: TransformOptions = {
      babelrc: false,
      presets: ['env', 'foo-preset'],
      plugins: ['bar-plugin'],
    };

    const config = preset.babel(babelConfig);

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

    const config = preset.babel(babelConfig);

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
