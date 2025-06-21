#!/usr/bin/env node
import arg from 'arg';
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { buildIndex } from 'storybook/internal/core-server';
import { generateMaestroTest } from './utils/maestro-generator.js';
import {
  compareScreenshots,
  updateBaseline as updateBaselineUtil,
} from './utils/screenshot-comparison.js';

function showHelp() {
  console.log(`
Usage: npx @storybook/react-native-test screenshot-stories [options]

Take screenshots of all Storybook stories and compare them against baselines

Options:
  -c, --config-dir <path>        Path to Storybook config directory (default: ./.rnstorybook)
  -o, --output-dir <path>        Output directory for maestro files (default: ./.maestro)
  -a, --app-id <id>              App ID for maestro tests (default: host.exp.Exponent)
  -u, --base-uri <uri>           Base URI for deep links (default: exp://127.0.0.1:8081/--/)
  -n, --test-name <name>         Name for the maestro test file (default: storybook-screenshots)
  -b, --baseline-dir <path>      Directory containing baseline screenshots (default: ./.maestro/baseline)
  -s, --screenshots-dir <path>   Directory for new screenshots (default: ./.maestro/screenshots)
  -d, --diffs-dir <path>         Directory for diff images (default: ./.maestro/diffs)
  -t, --tolerance <number>       Tolerance for image comparison (default: 2.5)
  --strict                       Use strict image comparison
  --skip-generate                Skip generating maestro test file
  --skip-test                    Skip running maestro tests
  --skip-compare                 Skip comparing screenshots
  --update-baseline              Copy current screenshots to baseline directory
  -h, --help                     Show this help message

Examples:
  npx @storybook/react-native-test screenshot-stories
  npx @storybook/react-native-test screenshot-stories --app-id com.myapp --tolerance 5
  npx @storybook/react-native-test screenshot-stories --skip-generate --skip-test
  npx @storybook/react-native-test screenshot-stories --update-baseline
`);
}

const run = async () => {
  let args;

  try {
    args = arg({
      // Types
      '--help': Boolean,
      '--config-dir': String,
      '--output-dir': String,
      '--app-id': String,
      '--base-uri': String,
      '--test-name': String,
      '--baseline-dir': String,
      '--screenshots-dir': String,
      '--diffs-dir': String,
      '--tolerance': Number,
      '--strict': Boolean,
      '--skip-generate': Boolean,
      '--skip-test': Boolean,
      '--skip-compare': Boolean,
      '--update-baseline': Boolean,

      // Aliases
      '-h': '--help',
      '-c': '--config-dir',
      '-o': '--output-dir',
      '-a': '--app-id',
      '-u': '--base-uri',
      '-n': '--test-name',
      '-b': '--baseline-dir',
      '-s': '--screenshots-dir',
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
  const configDir = args['--config-dir'] || './.rnstorybook';
  const outputDir = args['--output-dir'] || './.maestro';
  const appId = args['--app-id'] || 'host.exp.Exponent';
  const baseUri = args['--base-uri'] || 'exp://127.0.0.1:8081/--/';
  const testName = args['--test-name'] || 'storybook-screenshots';
  const baselineDir = args['--baseline-dir'] || path.join(outputDir, 'baseline');
  const screenshotsDir = args['--screenshots-dir'] || path.join(outputDir, 'screenshots');
  const diffsDir = args['--diffs-dir'] || path.join(outputDir, 'diffs');
  const tolerance = args['--tolerance'] || 2.5;
  const strict = args['--strict'] || false;
  const skipGenerate = args['--skip-generate'] || false;
  const skipTest = args['--skip-test'] || false;
  const skipCompare = args['--skip-compare'] || false;
  const updateBaseline = args['--update-baseline'] || false;

  try {
    const resolvedOutputDir = path.isAbsolute(outputDir)
      ? outputDir
      : path.join(process.cwd(), outputDir);

    // Step 1: Generate Maestro test file
    if (!skipGenerate) {
      console.log('\n📝 Generating Maestro test file...');

      const resolvedConfigDir = path.isAbsolute(configDir)
        ? configDir
        : path.join(process.cwd(), configDir);

      const index = await buildIndex({
        configDir: resolvedConfigDir,
      });

      const success = await generateMaestroTest({
        index,
        outputDir: resolvedOutputDir,
        appId,
        baseUri,
        testName,
        screenshotsRelativePath: screenshotsDir,
      });

      if (!success) {
        console.error('Failed to generate Maestro test file');
        process.exit(1);
      }
    }

    // Step 2: Run Maestro tests
    const maestroTestPath = path.join(resolvedOutputDir, `${testName}.yaml`);

    if (!skipTest) {
      console.log('\n🎯 Running Maestro tests...');

      if (!existsSync(maestroTestPath)) {
        console.error(`Maestro test file not found at: ${maestroTestPath}`);
        console.error('Run without --skip-generate to generate the test file first');
        process.exit(1);
      }

      // Ensure screenshots directory exists
      const resolvedScreenshotsDir = path.isAbsolute(screenshotsDir)
        ? screenshotsDir
        : path.join(process.cwd(), screenshotsDir);

      mkdirSync(resolvedScreenshotsDir, { recursive: true });

      try {
        execSync(`maestro test ${maestroTestPath}`, {
          stdio: 'inherit',
          env: { ...process.env },
        });
        console.log('✅ Maestro tests completed successfully');
      } catch (error) {
        console.error('❌ Maestro tests failed');
        // Continue to comparison even if tests fail (might still have some screenshots)
      }
    }

    // Step 3: Update baseline if requested (do this before comparison)
    if (updateBaseline) {
      console.log('\n📋 Updating baseline screenshots...');
      
      const resolvedScreenshotsDir = path.isAbsolute(screenshotsDir)
        ? screenshotsDir
        : path.join(process.cwd(), screenshotsDir);
      
      const resolvedBaselineDir = path.isAbsolute(baselineDir)
        ? baselineDir
        : path.join(process.cwd(), baselineDir);

      if (!existsSync(resolvedScreenshotsDir)) {
        console.error(`Screenshots directory not found: ${resolvedScreenshotsDir}`);
        console.error('Run without --skip-test to generate screenshots first');
        process.exit(1);
      }

      try {
        await updateBaselineUtil(resolvedScreenshotsDir, resolvedBaselineDir);
        console.log('✅ Baseline screenshots updated successfully!');
      } catch (error) {
        console.error('❌ Failed to update baseline screenshots:', error);
        process.exit(1);
      }
    }

    // Step 4: Compare screenshots (skip if we just updated baseline)
    if (!skipCompare && !updateBaseline) {
      console.log('\n🔍 Comparing screenshots...');

      const resolvedScreenshotsDir = path.isAbsolute(screenshotsDir)
        ? screenshotsDir
        : path.join(process.cwd(), screenshotsDir);

      const resolvedBaselineDir = path.isAbsolute(baselineDir)
        ? baselineDir
        : path.join(process.cwd(), baselineDir);

      const resolvedDiffsDir = path.isAbsolute(diffsDir)
        ? diffsDir
        : path.join(process.cwd(), diffsDir);

      if (!existsSync(resolvedScreenshotsDir)) {
        console.error(`Screenshots directory not found: ${resolvedScreenshotsDir}`);
        console.error('Run without --skip-test to generate screenshots first');
        process.exit(1);
      }

      if (!existsSync(resolvedBaselineDir)) {
        console.warn(`Baseline directory not found: ${resolvedBaselineDir}`);
        console.warn('No baseline screenshots to compare against');
        console.warn(
          'Consider copying current screenshots to baseline directory for future comparisons'
        );
        process.exit(0);
      }

      const results = await compareScreenshots({
        screenshotsDir: resolvedScreenshotsDir,
        baselineDir: resolvedBaselineDir,
        diffsDir: resolvedDiffsDir,
        tolerance,
        strict,
      });

      console.log('\n📊 Comparison Results:');
      console.log(`  Total: ${results.total}`);
      console.log(`  Matches: ${results.matches}`);
      console.log(`  Differences: ${results.differences}`);
      console.log(`  Missing baselines: ${results.missingBaselines}`);

      if (results.differences > 0) {
        console.log(`\n⚠️  ${results.differences} screenshots have differences`);
        console.log(`Diff images saved to: ${resolvedDiffsDir}`);
        process.exit(1);
      }

      console.log('\n✅ All screenshots match!');
    }

  } catch (err: any) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

run();
