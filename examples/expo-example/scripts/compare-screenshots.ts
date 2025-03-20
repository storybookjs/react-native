import * as fs from 'fs';
import * as path from 'path';
import * as looksSame from 'looks-same';
import { fileURLToPath } from 'url';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screenshotsDir = path.resolve(__dirname, '..', '.maestro', 'screenshots');
const baselineDir = path.resolve(__dirname, '..', '.maestro', 'baseline');
const diffsDir = path.resolve(__dirname, '..', '.maestro', 'diffs');

// Add debug logging
console.log('Paths:', {
  screenshotsDir,
  baselineDir,
  diffsDir,
});

async function compareScreenshots() {
  const screenshots = fs.readdirSync(screenshotsDir);
  console.log('screenshots', screenshots);
  for (const screenshot of screenshots) {
    const currentPath = path.join(screenshotsDir, screenshot);
    const baselinePath = path.join(baselineDir, screenshot);
    const diffPath = path.join(diffsDir, `diff_${screenshot}`);

    if (!fs.existsSync(baselinePath)) {
      console.log(`Baseline not found for ${screenshot}`);
      continue;
    }

    try {
      const result = await looksSame(baselinePath, currentPath, {
        strict: false,
        tolerance: 2.5,
        createDiffImage: true,
      });

      if (!result.equal) {
        await result.diffImage?.save(diffPath);
      }

      console.log(`${screenshot}: ${result.equal ? 'Match' : 'Differs'}`);
    } catch (error) {
      console.error(`Error comparing ${screenshot}:`, error);
    }
  }
}

compareScreenshots().catch(console.error);
