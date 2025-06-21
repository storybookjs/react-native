#!/usr/bin/env node
import path from 'path';
import arg from 'arg';
import {
  compareScreenshots,
  updateBaseline,
  generateHtmlReport,
  parseIgnoreRegions,
} from './utils/screenshot-comparison.js';

function showHelp() {
  console.log(`
Usage: npx @storybook/react-native-test compare-screenshots [options]

Compare screenshots against baseline images

Options:
  -s, --screenshots-dir <path>   Directory containing new screenshots (default: ./.maestro/screenshots)
  -b, --baseline-dir <path>      Directory containing baseline screenshots (default: ./.maestro/baseline)
  -d, --diffs-dir <path>         Directory for diff images (default: ./.maestro/diffs)
  -t, --tolerance <number>       Tolerance for image comparison (default: 2.5)
  --strict                       Use strict image comparison
  --update-baseline              Copy current screenshots to baseline directory
  --html-report                  Generate HTML comparison report
  --ignore-regions <regions>     Ignore custom regions (format: "x,y,w,h;x2,y2,w2,h2")
  -h, --help                     Show this help message

Examples:
  npx @storybook/react-native-test compare-screenshots
  npx @storybook/react-native-test compare-screenshots --tolerance 5 --strict
  npx @storybook/react-native-test compare-screenshots --update-baseline
  npx @storybook/react-native-test compare-screenshots --html-report
  npx @storybook/react-native-test compare-screenshots --ignore-regions "0,800,390,44;10,10,50,50"
`);
}

const run = async () => {
  let args;

  try {
    args = arg({
      // Types
      '--help': Boolean,
      '--screenshots-dir': String,
      '--baseline-dir': String,
      '--diffs-dir': String,
      '--tolerance': Number,
      '--strict': Boolean,
      '--update-baseline': Boolean,
      '--html-report': Boolean,
      '--ignore-regions': String,

      // Aliases
      '-h': '--help',
      '-s': '--screenshots-dir',
      '-b': '--baseline-dir',
      '-d': '--diffs-dir',
      '-t': '--tolerance',
    });
  } catch (err: any) {
    console.error(err.message);
    showHelp();
    process.exit(1);
  }

  if (args['--help']) {
    showHelp();
    process.exit(0);
  }

  // Set defaults
  const defaultDir = './.maestro';
  const screenshotsDir = args['--screenshots-dir'] || path.join(defaultDir, 'screenshots');
  const baselineDir = args['--baseline-dir'] || path.join(defaultDir, 'baseline');
  const diffsDir = args['--diffs-dir'] || path.join(defaultDir, 'diffs');
  const tolerance = args['--tolerance'] || 2.5;
  const strict = args['--strict'] || false;
  const updateBaselineFlag = args['--update-baseline'] || false;
  const htmlReport = args['--html-report'] || false;
  const ignoreRegionsStr = args['--ignore-regions'];

  try {
    const resolvedScreenshotsDir = path.isAbsolute(screenshotsDir)
      ? screenshotsDir
      : path.join(process.cwd(), screenshotsDir);

    const resolvedBaselineDir = path.isAbsolute(baselineDir)
      ? baselineDir
      : path.join(process.cwd(), baselineDir);

    // Update baseline if requested
    if (updateBaselineFlag) {
      await updateBaseline(resolvedScreenshotsDir, resolvedBaselineDir);
      process.exit(0);
    }

    // Compare screenshots
    const resolvedDiffsDir = path.isAbsolute(diffsDir)
      ? diffsDir
      : path.join(process.cwd(), diffsDir);

    console.log('🔍 Comparing screenshots...\n');
    console.log(`Screenshots: ${resolvedScreenshotsDir}`);
    console.log(`Baseline: ${resolvedBaselineDir}`);
    console.log(`Diffs: ${resolvedDiffsDir}`);
    console.log(`Tolerance: ${tolerance}`);
    console.log(`Strict mode: ${strict}`);
    console.log();

    // Parse custom ignore regions if provided
    let ignoreRegions: Array<{ x: number; y: number; width: number; height: number }> | undefined;

    if (ignoreRegionsStr) {
      ignoreRegions = parseIgnoreRegions(ignoreRegionsStr);
    }

    const results = await compareScreenshots({
      screenshotsDir: resolvedScreenshotsDir,
      baselineDir: resolvedBaselineDir,
      diffsDir: resolvedDiffsDir,
      tolerance,
      strict,
      ...(ignoreRegions && { ignoreRegions }),
    });

    console.log('\n📊 Comparison Results:');
    console.log(`  Total: ${results.total}`);
    console.log(`  Matches: ${results.matches}`);
    console.log(`  Differences: ${results.differences}`);
    console.log(`  Missing baselines: ${results.missingBaselines}`);

    // Generate HTML report if requested
    if (htmlReport) {
      const reportPath = await generateHtmlReport(results, {
        screenshotsDir: resolvedScreenshotsDir,
        baselineDir: resolvedBaselineDir,
        diffsDir: resolvedDiffsDir,
        tolerance,
        strict,
        ...(ignoreRegions && { ignoreRegions }),
      });
      console.log(`\n📄 HTML report generated: ${reportPath}`);
    }

    if (results.missingBaselines > 0) {
      console.log('\n💡 Tip: Run with --update-baseline to set current screenshots as baseline');
    }

    if (results.differences > 0) {
      console.log(`\n⚠️  ${results.differences} screenshots have differences`);
      console.log(`Diff images saved to: ${resolvedDiffsDir}`);
      if (htmlReport) {
        console.log('Open the HTML report to view detailed comparisons');
      }
      process.exit(1);
    }

    if (results.total === 0) {
      console.log('\n⚠️  No screenshots found to compare');
      process.exit(1);
    }

    console.log('\n✅ All screenshots match!');
  } catch (err: any) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

run();
