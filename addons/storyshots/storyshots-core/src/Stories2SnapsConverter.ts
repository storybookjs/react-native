import path from 'path';
import dedent from 'ts-dedent';

const defaultOptions: Stories2SnapsConverterOptions = {
  snapshotsDirName: '__snapshots__',
  snapshotExtension: '.storyshot',
  storiesExtensions: ['.js', '.jsx', '.ts', '.tsx'],
};

export interface Stories2SnapsConverterOptions {
  storiesExtensions: string[];
  snapshotExtension: string;
  snapshotsDirName: string;
}

export class Stories2SnapsConverter {
  options: Stories2SnapsConverterOptions;

  constructor(options: Partial<Stories2SnapsConverterOptions> = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  getSnapshotExtension = () => this.options.snapshotExtension;

  getStoryshotFile(fileName: string) {
    const { dir, name } = path.parse(fileName);
    const { snapshotsDirName, snapshotExtension } = this.options;

    return path.format({ dir: path.join(dir, snapshotsDirName), name, ext: snapshotExtension });
  }

  getSnapshotFileName(context: { fileName?: string, kind: any }) {
    const { fileName, kind } = context;

    if (!fileName) {
      // eslint-disable-next-line no-console
      console.warn(
        dedent`
          Storybook was unable to detect filename for stories of kind "${kind}".
          To fix it, add following to your jest.config.js:
              transform: {
                // should be above any other js transform like babel-jest
                '^.+\\\\.stories\\\\.js$': '@storybook/addon-storyshots/injectFileName',
              }
        `
      );
      return null;
    }

    return this.getStoryshotFile(fileName);
  }

  getPossibleStoriesFiles(storyshotFile: string) {
    const { dir, name } = path.parse(storyshotFile);
    const { storiesExtensions } = this.options;

    return storiesExtensions.map(ext =>
      path.format({
        dir: path.dirname(dir),
        name,
        ext,
      })
    );
  }
}
