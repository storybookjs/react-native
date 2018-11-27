const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: [__dirname],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(md)$': '<rootDir>/__mocks__/htmlMock.js',
  },
  transform: {
    ...config.transform,
    '^.+\\.svg$': '<rootDir>/node_modules/react-scripts/config/jest/fileTransform.js',
  },
  moduleDirectories: ['<rootDir>/node_modules', 'src'],
};
