describe('Storyshots', () => {
  xit('should run snapshot tests, but we\'ve disabled this temporarily', () => {});
});

// NOTE: this file should contain a snapshot test, but it is temporarily disabled.
//
// From @tmeasday: "Both Lerna/npm5 and Jest are incompatible, so we cannot run
// Jest tests right now, unless we go to great lengths (see `test-cra`'s build process)."
//
// A succinct repro here: https://github.com/tmeasday/preserve-symlinks-test
//
// Once this difference is resolved, we should uncomment the following code:
//
// import initStoryshots, { snapshotWithOptions } from '@storybook/addon-storyshots';
// import path from 'path';
//
// function createNodeMock(element) {
//   if (element.type === 'div') {
//     return { scrollWidth: 123 };
//   }
//   return null;
// }
//
// initStoryshots({
//   framework: 'react',
//   configPath: path.join(__dirname, '..', '.storybook'),
//   test: snapshotWithOptions({
//     createNodeMock,
//   }),
// });
