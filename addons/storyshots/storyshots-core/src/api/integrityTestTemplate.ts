import fs from 'fs';
import glob from 'glob';
import { describe, it } from 'global';

function integrityTest(integrityOptions: any, stories2snapsConverter: any) {
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

      expect(abandonedStoryshots).toEqual([]);
    });
  });
}

export default integrityTest;
