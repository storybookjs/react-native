module.exports = {
  preset: 'jest-preset-angular',
  testPathIgnorePatterns: ['/node_modules/', '/storybook-static/', 'angularshots.test.js', 'dist'],
  setupFilesAfterEnv: ['./jest-config/setup.ts'],
};
