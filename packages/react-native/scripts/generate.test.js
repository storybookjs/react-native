const path = require('path');
const { generate } = require('./generate');

let pathMock;
let fileContentMock;

global.window.navigator = {};

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: (filePath, fileContent, opts) => {
    pathMock = filePath;
    fileContentMock = fileContent;
  },
}));

describe('loader', () => {
  describe('writeRequires', () => {
    describe('when there is a story glob', () => {
      it('writes the story imports', () => {
        generate({ configPath: 'scripts/mocks/all-config-files' });
        expect(pathMock).toEqual(
          path.resolve(__dirname, 'mocks/all-config-files/storybook.requires.ts')
        );
        expect(fileContentMock).toMatchSnapshot();
      });
    });

    describe('when using js', () => {
      it('writes the story imports without types', () => {
        generate({ configPath: 'scripts/mocks/all-config-files', useJs: true });
        expect(pathMock).toEqual(
          path.resolve(__dirname, 'mocks/all-config-files/storybook.requires.js')
        );
        expect(fileContentMock).toMatchSnapshot();
      });
    });

    describe('when there are different file extensions', () => {
      it('writes the story imports', () => {
        generate({ configPath: 'scripts/mocks/file-extensions' });
        expect(pathMock).toEqual(
          path.resolve(__dirname, 'mocks/file-extensions/storybook.requires.ts')
        );
        expect(fileContentMock).toMatchSnapshot();
      });
    });

    // TODO can we support exclude globs?
    // describe('when there is a story glob and exclude paths globs', () => {
    //   it('writes the story imports', () => {
    //     generate({ configPath: 'scripts/mocks/exclude-config-files' });
    //     expect(pathMock).toEqual(
    //       path.resolve(__dirname, 'mocks/exclude-config-files/storybook.requires.ts')
    //     );

    //     expect(fileContentMock).toContain('include-components/FakeStory.stories.tsx');
    //     expect(fileContentMock).not.toContain('exclude-components/FakeStory.stories.tsx');

    //     expect(fileContentMock).toMatchSnapshot();
    //   });
    // });

    describe('when there is no story glob or addons', () => {
      it('throws an error', () => {
        expect(() => generate({ configPath: 'scripts/mocks/blank-config' })).toThrow();
      });
    });

    describe('when there is no preview', () => {
      it('does not add preview related stuff', () => {
        generate({ configPath: 'scripts/mocks/no-preview' });
        expect(pathMock).toEqual(path.resolve(__dirname, 'mocks/no-preview/storybook.requires.ts'));
        expect(fileContentMock).toMatchSnapshot();
      });
    });

    // TODO does this still make sense?
    // describe('when the absolute option is true', () => {
    //   it('should write absolute paths to the requires file', () => {
    //     generate({ configPath: 'scripts/mocks/all-config-files', absolute: true });
    //     expect(pathMock).toEqual(
    //       path.resolve(__dirname, 'mocks/all-config-files/storybook.requires.ts')
    //     );

    //     // expect(fileContentMock).toContain(`FakeStory.stories.tsx`);
    //     expect(fileContentMock).toContain(path.resolve(__dirname, 'mocks/all-config-files'));
    //   });
    // });

    describe('when there is a configuration object', () => {
      it('writes the story imports', () => {
        generate({ configPath: 'scripts/mocks/configuration-objects' });
        expect(pathMock).toEqual(
          path.resolve(__dirname, 'mocks/configuration-objects/storybook.requires.ts')
        );
        expect(fileContentMock).toMatchSnapshot();
      });
    });
  });
});
