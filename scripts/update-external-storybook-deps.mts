#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DependencyLocation {
  version: string;
  location: string;
}

const IGNORED_PACKAGES = new Set(['@storybook/addon-react-native-server', '@storybook/mcp']);

function getTargetVersionFromArgs(): string | undefined {
  const args = process.argv.slice(2);
  let targetVersion: string | undefined;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '--version' || arg === '-v') {
      const nextArg = args[i + 1];
      if (!nextArg || nextArg.startsWith('-')) {
        console.error('❌ Expected a version after --version/-v');
        process.exit(1);
      }
      targetVersion = nextArg;
      i += 1;
    } else if (arg.startsWith('--version=')) {
      targetVersion = arg.slice('--version='.length);
    } else if (arg.startsWith('-v=')) {
      targetVersion = arg.slice('-v='.length);
    }
  }

  if (targetVersion === '') {
    console.error('❌ Version cannot be empty.');
    process.exit(1);
  }

  return targetVersion;
}

/**
 * Get all internal package names from the monorepo
 */
function getInternalPackageNames(): Set<string> {
  const packageJsonPaths = glob.sync('packages/*/package.json', {
    cwd: path.join(__dirname, '..'),
    absolute: true,
  });

  const internalPackages = new Set<string>();

  for (const pkgPath of packageJsonPaths) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    if (pkg.name) {
      internalPackages.add(pkg.name);
    }
  }

  return internalPackages;
}

/**
 * Get all package.json files in the monorepo
 */
function getAllPackageJsonPaths(): string[] {
  return glob.sync('{packages,examples,docs}/*/package.json', {
    cwd: path.join(__dirname, '..'),
    absolute: true,
  });
}

/**
 * Extract Storybook dependencies that are NOT internal packages
 */
function getExternalStorybookDeps(
  packageJsonPath: string,
  internalPackages: Set<string>
): Array<{ name: string; version: string; packageJsonPath: string }> {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const externalDeps: Array<{ name: string; version: string; packageJsonPath: string }> = [];

  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
  };

  for (const [depName, version] of Object.entries(allDeps)) {
    // Check if it's a Storybook package and NOT an internal package
    if (
      (depName.startsWith('@storybook/') || depName === 'storybook') &&
      !internalPackages.has(depName) &&
      !IGNORED_PACKAGES.has(depName)
    ) {
      externalDeps.push({ name: depName, version: version as string, packageJsonPath });
    }
  }

  return externalDeps;
}

/**
 * Look up the latest version of a package from the npm registry
 */
function getLatestVersion(packageName: string): string {
  const result = execSync(`npm view ${packageName} version`, { encoding: 'utf-8' }).trim();
  return result;
}

/**
 * Resolve the target version for a package
 */
function resolveVersion(depName: string, targetVersion: string | undefined): string {
  if (targetVersion) {
    return targetVersion;
  }

  const latest = getLatestVersion(depName);
  console.log(`  ${depName}: resolved latest → ${latest}`);
  return latest;
}

/**
 * Update a dependency version in a package.json file, preserving the range prefix
 */
function updateDepInPackageJson(pkgPath: string, depName: string, newVersion: string): boolean {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  let changed = false;

  for (const depType of ['dependencies', 'devDependencies'] as const) {
    if (pkg[depType]?.[depName]) {
      const current = pkg[depType][depName] as string;
      if (current !== newVersion) {
        pkg[depType][depName] = newVersion;
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  }

  return changed;
}

/**
 * Main execution
 */
function main(): void {
  console.log('🔍 Identifying internal packages...\n');
  const internalPackages = getInternalPackageNames();

  const targetVersion = getTargetVersionFromArgs();
  if (targetVersion) {
    console.log(`🎯 Target version: ${targetVersion}\n`);
  }

  console.log('Internal packages (will NOT be updated):');
  internalPackages.forEach((pkg) => console.log(`  - ${pkg}`));
  console.log('');

  console.log('🔍 Scanning for external Storybook dependencies...\n');
  const allPackageJsons = getAllPackageJsonPaths();
  const allExternalDeps = new Map<string, DependencyLocation[]>();

  for (const pkgPath of allPackageJsons) {
    const externalDeps = getExternalStorybookDeps(pkgPath, internalPackages);
    for (const dep of externalDeps) {
      if (!allExternalDeps.has(dep.name)) {
        allExternalDeps.set(dep.name, []);
      }
      allExternalDeps.get(dep.name)!.push({
        version: dep.version,
        location: path.relative(path.join(__dirname, '..'), pkgPath),
      });
    }
  }

  if (allExternalDeps.size === 0) {
    console.log('✅ No external Storybook dependencies found.');
    return;
  }

  console.log('External Storybook dependencies found:');
  allExternalDeps.forEach((locations, depName) => {
    console.log(`\n  ${depName}:`);
    locations.forEach(({ version, location }) => {
      console.log(`    - ${location} (${version})`);
    });
  });

  console.log('\n📦 Resolving versions...\n');

  // Resolve target versions for each unique dep
  const resolvedVersions = new Map<string, string>();
  for (const depName of allExternalDeps.keys()) {
    resolvedVersions.set(depName, resolveVersion(depName, targetVersion));
  }

  console.log('\n📝 Updating package.json files...\n');

  // Update each package.json that contains these deps
  let totalChanges = 0;
  for (const pkgPath of allPackageJsons) {
    const relativePath = path.relative(path.join(__dirname, '..'), pkgPath);
    const externalDeps = getExternalStorybookDeps(pkgPath, internalPackages);

    for (const dep of externalDeps) {
      const newVersion = resolvedVersions.get(dep.name);
      if (newVersion) {
        const changed = updateDepInPackageJson(pkgPath, dep.name, newVersion);
        if (changed) {
          console.log(`  Updated ${dep.name} in ${relativePath}`);
          totalChanges++;
        }
      }
    }
  }

  if (totalChanges === 0) {
    console.log('  No changes needed — all versions are already up to date.');
    return;
  }

  console.log(`\n📦 Running pnpm install to update lockfile...\n`);

  try {
    execSync('pnpm install', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    });

    console.log('\n✅ Successfully updated external Storybook dependencies!');
  } catch (error) {
    console.error('\n❌ Error running pnpm install:', (error as Error).message);
    process.exit(1);
  }
}

main();
