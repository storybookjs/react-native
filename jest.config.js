module.exports = {
  globals: {
    __TRANSFORM_HTML__: true,
  },
  cacheDirectory: '.cache/jest',
  clearMocks: true,
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(md)$': '<rootDir>/__mocks__/htmlMock.js',
  },
  roots: [
    '<rootDir>/addons',
    '<rootDir>/app',
    '<rootDir>/lib',
    '<rootDir>/examples/cra-kitchen-sink',
    '<rootDir>/examples/vue-kitchen-sink',
    '<rootDir>/examples/official-storybook',
    '<rootDir>/examples/angular-cli',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.(ts|html)$': '<rootDir>/node_modules/jest-preset-angular/preprocessor.js',
    '.*\\.(vue)$': '<rootDir>/node_modules/jest-vue-preprocessor',
  },
  testPathIgnorePatterns: ['/node_modules/', 'addon-jest.test.js', '/cli/test/'],
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
  testURL: 'http://localhost',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', '.html', 'vue'],
};
