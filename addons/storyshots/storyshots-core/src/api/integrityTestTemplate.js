import fs from 'fs';
import glob from 'glob';

function integrityTest(integrityOptions, stories2snapsConverter) {
  if (integrityOptions === false) {
    return;
  }

  describe('Storyshots Integrity', () => {
    test('Abandoned Storyshots', () => {
      const snapshotExtension = stories2snapsConverter.getSnapshotExtension();
      const storyshots = glob.sync(`**/*${snapshotExtension}`, integrityOptions);

      const abandonedStoryshots = storyshots.filter(fileName => {
        const possibleStoriesFiles = stories2snapsConverter.getPossibleStoriesFiles(fileName);
        return !possibleStoriesFiles.some(fs.existsSync);
      });
      expect(abandonedStoryshots).toHaveLength(0);
    });
  });
}

export default integrityTest;
