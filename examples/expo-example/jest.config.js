// we use a config file because it resolves rootdir correctly

/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};

module.exports = config;
