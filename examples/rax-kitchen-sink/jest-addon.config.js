module.exports = {
  roots: [__dirname],
  moduleNameMapper: {
    '\\.(css|scss|stylesheet)$': '<rootDir>/../../__mocks__/styleMock.js',
    '\\.(md)$': '<rootDir>/../../__mocks__/htmlMock.js',
  },
  transform: {
    '^.+\\.jsx?$': '<rootDir>/../../scripts/babel-jest.js',
  },
  projects: ['<rootDir >'],
  moduleDirectories: ['<rootDir>/node_modules', 'src', '<rootDir>/../../node_modules'],
};
