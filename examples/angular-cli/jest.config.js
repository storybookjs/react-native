const config = require('../../jest.config');

module.exports = {
  ...config,
  globals: {
    __TRANSFORM_HTML__: true,
  },
  roots: [__dirname],
  transform: {
    ...config.transform,
    '^.+[/\\\\].storybook[/\\\\]config\\.ts$': '<rootDir>/scripts/jest-ts-babel.js',
    '^.+\\.(ts|html)$': '<rootDir>/node_modules/jest-preset-angular/preprocessor.js',
  },
  moduleFileExtensions: [...config.moduleFileExtensions, 'ts', 'tsx', 'html'],
};
