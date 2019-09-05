import path from 'path';
import initStoryshots, { multiSnapshotWithOptions, Stories2SnapsConverter } from '../src';

class AnotherStories2SnapsConverter extends Stories2SnapsConverter {
  getSnapshotFileName(context) {
    const { fileName, kind, name } = context;
    const { dir, name: filename } = path.parse(fileName);
    const uniqueName = `${filename}@${kind.replace(/ /g, '-_-')}@${name.replace(/ /g, '-_-')}`;
    const { snapshotsDirName, snapshotExtension } = this.options;

    return path.format({
      dir: path.join(dir, snapshotsDirName),
      name: uniqueName,
      ext: snapshotExtension,
    });
  }

  getPossibleStoriesFiles(storyshotFile) {
    const { dir, name } = path.parse(storyshotFile);
    const { storiesExtensions } = this.options;

    const [fileName] = name.split('@');

    return storiesExtensions.map(ext =>
      path.format({
        dir: path.dirname(dir),
        name: fileName,
        ext,
      })
    );
  }
}

initStoryshots({
  framework: 'react',
  integrityOptions: { cwd: __dirname },
  stories2snapsConverter: new AnotherStories2SnapsConverter({ snapshotExtension: '.boo' }),
  config: ({ configure }) =>
    configure(() => {
      // eslint-disable-next-line global-require
      require('../stories/directly_required');
    }, module),
  test: multiSnapshotWithOptions(),
});
