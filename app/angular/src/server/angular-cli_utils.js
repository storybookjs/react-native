import fs from 'fs';
import { basename, dirname, normalize, relative, resolve } from '@angular-devkit/core';

function isDirectory(assetPath) {
  try {
    return fs.statSync(assetPath).isDirectory();
  } catch (e) {
    return false;
  }
}

function getAssetsParts(resolvedAssetPath, assetPath) {
  if (isDirectory(resolvedAssetPath)) {
    return {
      glob: '**/*', // Folders get a recursive star glob.
      input: assetPath, // Input directory is their original path.
    };
  }

  return {
    glob: basename(assetPath), // Files are their own glob.
    input: dirname(assetPath), // Input directory is their original dirname.
  };
}

function isStylingRule(rule) {
  const { test } = rule;

  if (!test) {
    return false;
  }

  if (!(test instanceof RegExp)) {
    return false;
  }

  return test.test('.css') || test.test('.scss') || test.test('.sass');
}

export function filterOutStylingRules(config) {
  return config.module.rules.filter(rule => !isStylingRule(rule));
}

export function isBuildAngularInstalled() {
  try {
    require.resolve('@angular-devkit/build-angular');
    return true;
  } catch (e) {
    return false;
  }
}

export function normalizeAssetPatterns(assetPatterns, dirToSearch, sourceRoot) {
  if (!assetPatterns || !assetPatterns.length) {
    return [];
  }

  return assetPatterns.map(assetPattern => {
    if (typeof assetPattern === 'object') {
      return assetPattern;
    }

    const assetPath = normalize(assetPattern);
    const resolvedSourceRoot = resolve(dirToSearch, sourceRoot);
    const resolvedAssetPath = resolve(dirToSearch, assetPath);
    const parts = getAssetsParts(resolvedAssetPath, assetPath);

    // Output directory for both is the relative path from source root to input.
    const output = relative(resolvedSourceRoot, resolve(dirToSearch, parts.input));

    // Return the asset pattern in object format.
    return {
      ...parts,
      output,
    };
  });
}
