module.exports = {
  coveragePathIgnorePatterns: ['/jest-config/', '/node_modules/'],
  preset: 'jest-preset-angular',
  setupTestFrameworkScriptFile: './jest-config/setup.ts',
  snapshotSerializers: [
    '<rootDir>/../../node_modules/jest-preset-angular/AngularSnapshotSerializer.js',
    '<rootDir>/../../node_modules/jest-preset-angular/HTMLCommentSerializer.js',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/storybook-static/', 'angularshots.test.js', 'dist'],
  transform: {
    '^.+\\.(ts|js|html)$': '<rootDir>/../../node_modules/jest-preset-angular/preprocessor.js',
  },
};
