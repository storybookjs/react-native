module.exports = {
  overrides: [
    {
      files: ['./stories/addon-jest.stories.ts'],
      settings: {
        'import/core-modules': ['../../addon-jest.testresults.json'],
      },
    },
  ],
};
