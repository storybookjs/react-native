const path = require('path');
const { writeRequires, getMain, getPreviewExists } = require('./loader');

let pathMock;
let fileContentMock;

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: (filePath, fileContent, opts) => {
    pathMock = filePath;
    fileContentMock = fileContent;
  },
}));

jest.mock('prettier', () => ({
  format(s, opts) {
    return s;
  },
}));

describe('loader', () => {
  describe('getMain', () => {
    it('should return the main js default export as an object', () => {
      const main = getMain({ configPath: path.resolve(__dirname, 'mocks/all-config-files') });
      expect(main).toEqual({
        stories: ['./FakeStory.stories.tsx'],
        addons: [
          '@storybook/addon-ondevice-notes',
          '@storybook/addon-ondevice-controls',
          '@storybook/addon-ondevice-backgrounds',
          '@storybook/addon-ondevice-actions',
        ],
      });
    });

    it('should also work with relative paths', () => {
      // relative from where the command is run
      const main = getMain({ configPath: './scripts/mocks/all-config-files' });
      expect(main).toEqual({
        stories: ['./FakeStory.stories.tsx'],
        addons: [
          '@storybook/addon-ondevice-notes',
          '@storybook/addon-ondevice-controls',
          '@storybook/addon-ondevice-backgrounds',
          '@storybook/addon-ondevice-actions',
        ],
      });
    });
    it('should work for any supported file extension', () => {
      const main = getMain({ configPath: './scripts/mocks/file-extensions' });
      expect(main).toEqual({
        default: {
          stories: ['./FakeStory.stories.tsx'],
          addons: [
            '@storybook/addon-ondevice-notes',
            '@storybook/addon-ondevice-controls',
            '@storybook/addon-ondevice-backgrounds',
            '@storybook/addon-ondevice-actions',
          ],
        },
      });
    });
  });

  describe('getPreviewExists', () => {
    const supportedExtensions = ['js', 'jsx', 'ts', 'tsx'];
    describe('when using a relative path', () => {
      it('should return true if the preview exists', () => {
        supportedExtensions.forEach((ext) => {
          expect(getPreviewExists({ configPath: `scripts/mocks/preview-files/${ext}` })).toBe(true);
        });
      });

      it('should return false if the preview does not exist', () => {
        expect(getPreviewExists({ configPath: './scripts/mocks/no-preview' })).toBe(false);
      });

      it('should return false if the preview does not match any of supportedExtensions values', () => {
        expect(getPreviewExists({ configPath: './scripts/mocks/wrong-extension-preview' })).toBe(
          false
        );
      });
    });

    describe('when using an absolute path', () => {
      it('should return true if the preview exists', () => {
        supportedExtensions.forEach((ext) => {
          expect(
            getPreviewExists({
              configPath: path.resolve(__dirname, `mocks/preview-files/${ext}`),
            })
          ).toBe(true);
        });
      });

      it('should return false if the preview does not exist', () => {
        expect(getPreviewExists({ configPath: path.resolve(__dirname, 'mocks/no-preview') })).toBe(
          false
        );
      });

      it('should return false if the preview does not match any of supportedExtensions values', () => {
        expect(
          getPreviewExists({ configPath: path.resolve(__dirname, 'mocks/wrong-extension-preview') })
        ).toBe(false);
      });
    });
  });

  describe('writeRequires', () => {
    describe('when there is a story glob', () => {
      it('writes the story imports', () => {
        writeRequires({ configPath: 'scripts/mocks/all-config-files' });
        expect(pathMock).toEqual(
          path.resolve(__dirname, 'mocks/all-config-files/storybook.requires.js')
        );
        expect(fileContentMock).toMatchSnapshot();
      });
    });

    describe('when there are different file extensions', () => {
      it('writes the story imports', () => {
        writeRequires({ configPath: 'scripts/mocks/file-extensions' });
        expect(pathMock).toEqual(
          path.resolve(__dirname, 'mocks/file-extensions/storybook.requires.js')
        );
        expect(fileContentMock).toMatchSnapshot();
      });
    });

    describe('when there is a story glob and exclude paths globs', () => {
      it('writes the story imports', () => {
        writeRequires({ configPath: 'scripts/mocks/exclude-config-files' });
        expect(pathMock).toEqual(
          path.resolve(__dirname, 'mocks/exclude-config-files/storybook.requires.js')
        );

        expect(fileContentMock).toContain('include-components/FakeStory.stories.tsx');
        expect(fileContentMock).not.toContain('exclude-components/FakeStory.stories.tsx');

        expect(fileContentMock).toMatchSnapshot();
      });
    });

    describe('when there is no story glob or addons', () => {
      it('writes no story imports or addons', () => {
        writeRequires({ configPath: 'scripts/mocks/blank-config' });
        expect(pathMock).toEqual(
          path.resolve(__dirname, 'mocks/blank-config/storybook.requires.js')
        );
        expect(fileContentMock).toMatchSnapshot();
      });
    });

    describe('when there is no preview', () => {
      it('does not add preview related stuff', () => {
        writeRequires({ configPath: 'scripts/mocks/no-preview' });
        expect(pathMock).toEqual(path.resolve(__dirname, 'mocks/no-preview/storybook.requires.js'));
        expect(fileContentMock).toMatchSnapshot();
      });
    });

    describe('when the absolute option is true', () => {
      it('should write absolute paths to the requires file', () => {
        writeRequires({ configPath: 'scripts/mocks/all-config-files', absolute: true });
        expect(pathMock).toEqual(
          path.resolve(__dirname, 'mocks/all-config-files/storybook.requires.js')
        );
        expect(fileContentMock).toContain(
          path.resolve(__dirname, 'mocks/all-config-files/FakeStory.stories.tsx')
        );
      });
    });

    describe('when there is a configuration object', () => {
      it('writes the story imports', () => {
        writeRequires({ configPath: 'scripts/mocks/configuration-objects' });
        expect(pathMock).toEqual(
          path.resolve(__dirname, 'mocks/configuration-objects/storybook.requires.js')
        );
        expect(fileContentMock).toMatchSnapshot();
      });
    });
  });
});
