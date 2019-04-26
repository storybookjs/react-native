import fs from 'fs';
import glob from 'glob';
import { describe, it } from 'global';

function integrityTest(integrityOptions, stories2snapsConverter) {
  if (integrityOptions === false) {
    return;
  }

  describe('Storyshots Integrity', () => {
    it('Abandoned Storyshots', () => {
      const snapshotExtension = stories2snapsConverter.getSnapshotExtension();
      const storyshots = glob.sync(`**/*${snapshotExtension}`, integrityOptions);

      const abandonedStoryshots = storyshots.filter(fileName => {
        const possibleStoriesFiles = stories2snapsConverter.getPossibleStoriesFiles(fileName);
        return !possibleStoriesFiles.some(fs.existsSync);
      });
      expect(abandonedStoryshots.length).toBe(0);
    });
  });
}

export default integrityTest;
