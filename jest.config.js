module.exports = {
  cacheDirectory: '.cache/jest',
  clearMocks: true,
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  roots: [
    '<rootDir>/addons',
    '<rootDir>/app',
    '<rootDir>/lib',
    '<rootDir>/examples/cra-kitchen-sink',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/cli/test/'],
  collectCoverage: false,
  collectCoverageFrom: [
    'app/**/*.{js,jsx}',
    'lib/**/*.{js,jsx}',
    'addons/**/*.{js,jsx}',
    '!**/cli/test/**',
    '!**/generators/**',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  setupTestFrameworkScriptFile: './scripts/jest.init.js',
  setupFiles: ['raf/polyfill'],
};
