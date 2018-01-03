const path = require('path');
const globalJestConfig = require('../../../jest.config');

const finalJestConfig = globalJestConfig;

finalJestConfig.rootDir = path.join(__dirname, '../../..');
finalJestConfig.testMatch = [
  '<rootDir>/examples/official-storybook/image-snapshots/storyshots-image.runner.js',
];

module.exports = finalJestConfig;

//
// module.exports = {
//   rootDir: '../../../',
//   testMatch: ['<rootDir>/examples/official-storybook/image-snapshots/storyshots-image.runner.js'],
//   verbose: true,
//   notify: true,
//   transform: {
//     '^.+\\.jsx?$': 'babel-jest',
//   },
//   clearMocks: true,
//   moduleNameMapper: {
//     '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
//       '<rootDir>/__mocks__/fileMock.js',
//     '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
//     '\\.(md)$': '<rootDir>/__mocks__/htmlMock.js',
//   },
// };
