import { mkdirSync, readdirSync, existsSync } from 'fs';
import path from 'path';
import looksSame from 'looks-same';

export interface ComparisonOptions {
  screenshotsDir: string;
  baselineDir: string;
  diffsDir: string;
  tolerance?: number;
  strict?: boolean;
}

export interface ComparisonResult {
  total: number;
  matches: number;
  differences: number;
  missingBaselines: number;
  details: Array<{
    filename: string;
    status: 'match' | 'differ' | 'missing-baseline';
    diffPath?: string;
  }>;
}

export async function compareScreenshots(options: ComparisonOptions): Promise<ComparisonResult> {
  const { screenshotsDir, baselineDir, diffsDir, tolerance = 2.5, strict = false } = options;

  // Ensure diffs directory exists
  mkdirSync(diffsDir, { recursive: true });

  const result: ComparisonResult = {
    total: 0,
    matches: 0,
    differences: 0,
    missingBaselines: 0,
    details: [],
  };

  try {
    const screenshots = readdirSync(screenshotsDir).filter(
      (file) => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
    );

    result.total = screenshots.length;

    for (const screenshot of screenshots) {
      const currentPath = path.join(screenshotsDir, screenshot);
      const baselinePath = path.join(baselineDir, screenshot);
      const diffPath = path.join(diffsDir, `diff_${screenshot}`);

      if (!existsSync(baselinePath)) {
        console.log(`⚠️  No baseline for: ${screenshot}`);
        result.missingBaselines++;
        result.details.push({
          filename: screenshot,
          status: 'missing-baseline',
        });
        continue;
      }

      try {
        const comparisonResult = await looksSame(baselinePath, currentPath, {
          strict,
          tolerance,
          createDiffImage: true,
        });

        if (!comparisonResult.equal) {
          await comparisonResult.diffImage?.save(diffPath);
          console.log(`❌ ${screenshot}: Differs`);
          result.differences++;
          result.details.push({
            filename: screenshot,
            status: 'differ',
            diffPath,
          });
        } else {
          console.log(`✅ ${screenshot}: Match`);
          result.matches++;
          result.details.push({
            filename: screenshot,
            status: 'match',
          });
        }
      } catch (error) {
        console.error(`Error comparing ${screenshot}:`, error);
        result.differences++;
        result.details.push({
          filename: screenshot,
          status: 'differ',
        });
      }
    }
  } catch (error) {
    console.error('Error reading screenshots:', error);
    throw error;
  }

  return result;
}

export async function updateBaseline(screenshotsDir: string, baselineDir: string): Promise<void> {
  console.log('Updating baseline screenshots...');

  mkdirSync(baselineDir, { recursive: true });

  const screenshots = readdirSync(screenshotsDir).filter(
    (file) => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
  );

  for (const screenshot of screenshots) {
    const sourcePath = path.join(screenshotsDir, screenshot);
    const destPath = path.join(baselineDir, screenshot);

    // Use native Node.js copy
    const { copyFileSync } = await import('fs');
    copyFileSync(sourcePath, destPath);
    console.log(`📋 Copied: ${screenshot}`);
  }

  console.log(`✅ Updated ${screenshots.length} baseline screenshots`);
}
