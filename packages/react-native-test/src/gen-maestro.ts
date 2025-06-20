#!/usr/bin/env node
import { buildIndex } from 'storybook/internal/core-server';
import path from 'path';
import arg from 'arg';
import { generateMaestroTest } from './utils/maestro-generator.js';

function showHelp() {
  console.log(`
Usage: npx @storybook/react-native-test gen-maestro [options]

Generate Maestro test files for Storybook stories

Options:
  -c, --config-dir <path>   Path to Storybook config directory (default: ./.rnstorybook)
  -o, --output-dir <path>   Output directory for maestro files (default: ./.maestro)
  -a, --app-id <id>         App ID for maestro tests (default: host.exp.Exponent)
  -u, --base-uri <uri>      Base URI for deep links (default: exp://127.0.0.1:8081/--/)
  -n, --test-name <name>    Name for the maestro test file (default: storybook-screenshots)
  -s, --screenshots-dir <path>   Directory for screenshots relative to output dir (default: screenshots)
  -h, --help                Show this help message

Examples:
  npx @storybook/react-native-test gen-maestro
  npx @storybook/react-native-test gen-maestro --app-id com.myapp --config-dir ./storybook
  npx @storybook/react-native-test gen-maestro -a com.myapp -o ./e2e/maestro
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
      '--screenshots-dir': String,

      // Aliases
      '-h': '--help',
      '-c': '--config-dir',
      '-o': '--output-dir',
      '-a': '--app-id',
      '-u': '--base-uri',
      '-n': '--test-name',
      '-s': '--screenshots-dir',
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
  const screenshotsDir = args['--screenshots-dir'] || `${outputDir}/screenshots`;

  try {
    // Resolve config directory relative to current working directory
    const resolvedConfigDir = path.isAbsolute(configDir)
      ? configDir
      : path.join(process.cwd(), configDir);

    console.log(`Building story index from: ${resolvedConfigDir}`);

    const index = await buildIndex({
      configDir: resolvedConfigDir,
    });

    // Ensure output directory exists
    const resolvedOutputDir = path.isAbsolute(outputDir)
      ? outputDir
      : path.join(process.cwd(), outputDir);

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

    const maestroTestPath = path.join(resolvedOutputDir, `${testName}.yaml`);
    console.log(`\n✅ Generated Maestro test file: ${maestroTestPath}`);
    console.log(`\nTo run the tests:`);
    console.log(`  maestro test ${maestroTestPath}`);
  } catch (err: any) {
    console.error('Error generating Maestro test file:', err.message);
    process.exit(1);
  }
};

run();
