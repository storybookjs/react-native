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
      !internalPackages.has(depName)
    ) {
      externalDeps.push({ name: depName, version: version as string, packageJsonPath });
    }
  }

  return externalDeps;
}

/**
 * Main execution
 */
function main(): void {
  console.log('🔍 Identifying internal packages...\n');
  const internalPackages = getInternalPackageNames();

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

  console.log('\n📦 Updating external Storybook dependencies...\n');

  // Get the list of dependencies to update
  const depsToUpdate = Array.from(allExternalDeps.keys());

  try {
    // Use yarn up to update all external Storybook dependencies at once
    // Note: yarn up is the command for Yarn 2+
    const command = `yarn up ${depsToUpdate.join(' ')}`;
    console.log(`Running: ${command}\n`);

    execSync(command, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    });

    console.log('\n✅ Successfully updated external Storybook dependencies!');
  } catch (error) {
    console.error('\n❌ Error updating dependencies:', (error as Error).message);
    process.exit(1);
  }
}

main();
