import loadBabelConfig from './babel_config';

// eslint-disable-next-line global-require
jest.mock('fs', () => require('../../../../__mocks__/fs'));
jest.mock('path', () => ({
  resolve: () => '.babelrc',
  parse: require.requireActual('path').parse,
  join: require.requireActual('path').join,
  dirname: require.requireActual('path').dirname,
}));

const setup = ({ files }) => {
  // eslint-disable-next-line no-underscore-dangle, global-require
  require('fs').__setMockFiles(files);
};

describe('babel_config', () => {
  // As the 'fs' is going to be mocked, let's call require.resolve
  // so the require.cache has the correct route to the file.
  // In fact let's use it in the tests :)

  it('should return the config with the extra plugins when `plugins` is an array.', () => {
    setup({
      files: {
        '.babelrc': `{
        "presets": [
          "env",
          "foo-preset"
        ],
        "plugins": [
          "foo-plugin"
        ]
      }`,
      },
    });

    const config = loadBabelConfig('.foo');

    expect(config).toEqual({
      babelrc: false,
      plugins: ['foo-plugin'],
      presets: ['env', 'foo-preset'],
    });
  });

  it('should return the config with the extra plugins when `plugins` is not an array.', () => {
    setup({
      files: {
        '.babelrc': `{
            "presets": [
              "env",
              "foo-preset"
            ],
            "plugins": "bar-plugin"
          }`,
      },
    });

    const config = loadBabelConfig('.bar');

    expect(config).toEqual({
      babelrc: false,
      plugins: ['bar-plugin'],
      presets: ['env', 'foo-preset'],
    });
  });

  it('should return the config only with the extra plugins when `plugins` is not present.', () => {
    // Mock a `.babelrc` config file with no plugins key.
    setup({
      files: {
        '.babelrc': `{
            "presets": [
              "env",
              "foo-preset"
            ]
          }`,
      },
    });

    const config = loadBabelConfig('.biz');

    expect(config).toEqual({
      babelrc: false,
      plugins: [],
      presets: ['env', 'foo-preset'],
    });
  });
});
