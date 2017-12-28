module.exports = {
  verbose: true,
  notify: true,
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!lodash-es/.*)'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: ['../src/enzyme.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '../__mocks__/fileMock.js',
    '\\.s?css$': '../__mocks__/styleMock.js',
  },
  testMatch: ['<rootDir>/storyshots-image.runner.js'],
};
