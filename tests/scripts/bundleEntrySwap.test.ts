import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const thisDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(thisDirectory, '..', '..');

const APP_MARKER = 'SB-E2E-APP-ENTRY-MARKER';
const STORYBOOK_MARKER = 'SB-E2E-STORYBOOK-ENTRY-MARKER';
const WORKER = 'metro-transform-worker';
const CLI_PLUGIN = path.join('@react-native', 'community-cli-plugin');

/**
 * Storybook's entry-point swapping happens at transform time, so `react-native
 * bundle` — the same command Xcode and Gradle run for release builds — ships
 * Storybook instead of the app. `Metro.runBuild` is that code path, which is why
 * this runs a real bundle against the built package rather than a mock.
 */
const Metro = require('metro');
const { withStorybook } = require('@storybook/react-native/withStorybook');

type Fixture = {
  projectRoot: string;
  appEntryPoint: string;
  storybookEntryPoint: string;
};

let temporaryRoot: string | undefined;
const environmentBackup: Record<string, string | undefined> = {};

/** Everything this file writes goes here, and it is removed when the file finishes. */
function temporaryDirectory(): string {
  if (!temporaryRoot) {
    temporaryRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'sb-entry-swap-')));
  }
  return temporaryRoot;
}

after(() => {
  if (temporaryRoot) {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
});

function writeFixture(name: string): Fixture {
  const projectRoot = fs.realpathSync(fs.mkdtempSync(path.join(temporaryDirectory(), `${name}-`)));
  const appEntryPoint = path.join(projectRoot, 'index.js');
  const storybookEntryPoint = path.join(projectRoot, '.rnstorybook', 'index.js');

  fs.mkdirSync(path.join(projectRoot, '.rnstorybook'), { recursive: true });
  fs.writeFileSync(
    appEntryPoint,
    `const appMarker = '${APP_MARKER}';\nmodule.exports = appMarker;\n`
  );
  fs.writeFileSync(
    path.join(projectRoot, '.rnstorybook', 'main.js'),
    "module.exports = { stories: ['./**/*.stories.js'] };\n"
  );
  fs.writeFileSync(
    storybookEntryPoint,
    `const storybookMarker = '${STORYBOOK_MARKER}';\nmodule.exports = storybookMarker;\n`
  );
  fs.writeFileSync(
    path.join(projectRoot, 'package.json'),
    `${JSON.stringify({ name: 'storybook-entry-swap-fixture', main: 'index.js' }, null, 2)}\n`
  );

  return { projectRoot, appEntryPoint, storybookEntryPoint };
}

/**
 * A real project resolves Metro from its own `node_modules`, which is where
 * Storybook looks for the worker it has to chain to.
 */
function linkMetroIntoFixture(fixture: Fixture): void {
  const modules = path.join(fixture.projectRoot, 'node_modules');
  fs.mkdirSync(modules, { recursive: true });
  fs.symlinkSync(
    path.join(repositoryRoot, 'node_modules', 'metro'),
    path.join(modules, 'metro'),
    'dir'
  );
}

function storybookEnvironment(): void {
  for (const key of [
    'STORYBOOK_ENABLED',
    'STORYBOOK_SERVER',
    'STORYBOOK_DISABLE_TELEMETRY',
    'STORYBOOK_WS_HOST',
  ]) {
    environmentBackup[key] = process.env[key];
  }
  process.env.STORYBOOK_SERVER = 'false';
  process.env.STORYBOOK_DISABLE_TELEMETRY = 'true';
}

function restoreEnvironment(): void {
  for (const [key, value] of Object.entries(environmentBackup)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

/** A package folder Node can resolve, with just enough contents to be found. */
function writePackage(packageDirectory: string): void {
  fs.mkdirSync(packageDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(packageDirectory, 'package.json'),
    `${JSON.stringify({ name: path.basename(packageDirectory), version: '1.0.0' }, null, 2)}\n`
  );
  fs.writeFileSync(
    path.join(packageDirectory, 'index.js'),
    'exports.transform = async () => {};\n'
  );
}

/** Fill a fixture's `node_modules` with exactly the packages an install layout holds. */
function writeLayout(fixture: Fixture, packages: string[]): void {
  for (const packagePath of packages) {
    writePackage(path.join(fixture.projectRoot, 'node_modules', packagePath));
  }
}

/** The config `react-native bundle` would run, without Storybook in the picture. */
async function loadMetroConfig(fixture: Fixture): Promise<any> {
  const watchFolders = [fixture.projectRoot];
  const metroRuntime = path.join(repositoryRoot, 'node_modules', 'metro-runtime');
  if (fs.existsSync(metroRuntime)) {
    // The default config pulls its runtime from outside the fixture.
    watchFolders.push(fs.realpathSync(metroRuntime));
  }

  return Metro.loadConfig(
    { cwd: fixture.projectRoot, config: undefined },
    {
      projectRoot: fixture.projectRoot,
      watchFolders,
      cacheStores: [],
      resetCache: true,
      // Nothing to report, and no Watchman: this runs headless in CI.
      reporter: { update: () => {} },
      resolver: {
        nodeModulesPaths: [path.join(repositoryRoot, 'node_modules')],
        useWatchman: false,
      },
      transformer: { babelTransformerPath: require.resolve('metro-babel-transformer') },
    }
  );
}

async function bundle(config: any, fixture: Fixture, outputName: string): Promise<string> {
  const bundleOutput = path.join(temporaryDirectory(), `${outputName}.js`);
  await Metro.runBuild(config, {
    entry: fixture.appEntryPoint,
    out: bundleOutput,
    platform: 'ios',
    dev: true,
    minify: false,
  });
  return fs.readFileSync(bundleOutput, 'utf8');
}

/**
 * `withStorybook` generates the requires file without waiting for it, and writing that file
 * is the last thing generation does — so waiting for it leaves nothing in flight behind.
 */
async function waitForGeneration(fixture: Fixture): Promise<void> {
  const requiresFile = path.join(fixture.projectRoot, '.rnstorybook', 'storybook.requires.ts');
  const deadline = Date.now() + 10_000;
  while (!fs.existsSync(requiresFile)) {
    assert.ok(Date.now() < deadline, `Storybook never generated ${requiresFile}`);
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

describe('bundle entry-point swap', () => {
  let previousDirectory: string;

  before(() => {
    previousDirectory = process.cwd();
    storybookEnvironment();
  });

  after(() => {
    restoreEnvironment();
    process.chdir(previousDirectory);
  });

  it('bundles the Storybook entry instead of the app entry', async () => {
    const fixture = writeFixture('bundle');
    linkMetroIntoFixture(fixture);
    process.chdir(fixture.projectRoot);
    process.env.STORYBOOK_ENABLED = 'true';

    const config = withStorybook(await loadMetroConfig(fixture), { enabled: true });
    await waitForGeneration(fixture);

    const code = await bundle(config, fixture, 'storybook-enabled');

    assert.match(code, new RegExp(STORYBOOK_MARKER));
    assert.doesNotMatch(code, new RegExp(APP_MARKER));
  });

  it('bundles the app unchanged with Storybook disabled', async () => {
    const fixture = writeFixture('disabled');
    linkMetroIntoFixture(fixture);
    process.chdir(fixture.projectRoot);
    process.env.STORYBOOK_ENABLED = 'false';

    const config = await loadMetroConfig(fixture);
    const untouched = withStorybook(config, { enabled: false });
    assert.strictEqual(untouched, config, 'expected the config to be returned as it is');

    const storybookCode = await bundle(untouched, fixture, 'disabled');
    const plainCode = await bundle(config, fixture, 'plain');

    assert.match(storybookCode, new RegExp(APP_MARKER));
    assert.doesNotMatch(storybookCode, new RegExp(STORYBOOK_MARKER));
    assert.strictEqual(storybookCode, plainCode);
  });
});

/**
 * Storybook chains to the worker it replaced, so it has to find that worker where Metro finds
 * it: Metro loads `transformerPath` with a plain `require()` from inside its own package,
 * which is not where Storybook's package resolves the same bare name. Which copy that is
 * depends on the install layout, so every case below is a real folder tree.
 */
describe('the worker Storybook chains to', () => {
  let previousDirectory: string;

  before(() => {
    previousDirectory = process.cwd();
    storybookEnvironment();
    process.env.STORYBOOK_ENABLED = 'true';
  });

  after(() => {
    restoreEnvironment();
    process.chdir(previousDirectory);
  });

  /** The config `withStorybook` hands Metro for an app in this fixture. */
  async function enhance(fixture: Fixture): Promise<any> {
    // Storybook reads the app's entry and config folder from the working directory.
    process.chdir(fixture.projectRoot);
    const config: any = withStorybook(
      { transformer: {}, resolver: {}, projectRoot: fixture.projectRoot },
      { enabled: true }
    );
    await waitForGeneration(fixture);
    return config;
  }

  /** The worker `withStorybook` decided every other file belongs to. */
  function upstreamWorker(config: any): string | undefined {
    return config.transformer.storybookEntrySwap?.upstreamTransformerPath;
  }

  function workerIn(directory: string): string {
    return path.join(fs.realpathSync(path.join(directory, WORKER)), 'index.js');
  }

  it('uses the copy Metro itself loads, not the one hoisted above it', async () => {
    const fixture = writeFixture('hoisted-worker');
    writeLayout(fixture, [WORKER, 'metro', path.join('metro', 'node_modules', WORKER)]);

    const config = await enhance(fixture);

    assert.strictEqual(
      upstreamWorker(config),
      workerIn(path.join(fixture.projectRoot, 'node_modules', 'metro', 'node_modules'))
    );
  });

  it('follows the chain react-native runs the bundler through', async () => {
    // `pnpm install --hoist=false` and Yarn PnP: each package sits inside the one that needs
    // it, so nothing below `react-native` is visible to the app. The Metro and the worker the
    // app can resolve are decoys — neither is the one the running Metro loads.
    const metroInsidePlugin = path.join(
      'react-native',
      'node_modules',
      CLI_PLUGIN,
      'node_modules',
      'metro'
    );
    const fixture = writeFixture('hoist-free');
    writeLayout(fixture, [
      'react-native',
      path.join('react-native', 'node_modules', CLI_PLUGIN),
      metroInsidePlugin,
      path.join(metroInsidePlugin, 'node_modules', WORKER),
      'metro',
      WORKER,
    ]);

    const config = await enhance(fixture);

    assert.strictEqual(
      upstreamWorker(config),
      workerIn(path.join(fixture.projectRoot, 'node_modules', metroInsidePlugin, 'node_modules'))
    );
  });

  it('falls back to the Metro the app resolves, as Expo sets it up', async () => {
    const fixture = writeFixture('expo-like');
    writeLayout(fixture, ['metro', WORKER]);

    const config = await enhance(fixture);

    assert.strictEqual(
      upstreamWorker(config),
      workerIn(path.join(fixture.projectRoot, 'node_modules'))
    );
  });

  it('leaves the config alone and warns once when no worker can be found', async () => {
    const fixture = writeFixture('workerless');
    assert.throws(
      () =>
        createRequire(path.join(fixture.projectRoot, 'anchor.js')).resolve('metro/package.json'),
      /Cannot find module/
    );

    const warnings: string[] = [];
    const warn = console.warn;
    console.warn = (message?: unknown) => warnings.push(String(message));
    let config: any;
    try {
      config = await enhance(fixture);
    } finally {
      console.warn = warn;
    }

    // A config Metro can still load beats a broken swap: `react-native start` keeps swapping
    // through the resolver, and only bundling is left without it.
    assert.strictEqual(config.transformerPath, undefined);
    assert.strictEqual('storybookEntrySwap' in config.transformer, false);
    assert.strictEqual(warnings.length, 1);
    assert.match(warnings[0], /react-native bundle/);
  });
});
