import fs from 'fs';
import { basename, dirname, normalize, relative, resolve, Path } from '@angular-devkit/core';
import {
  getCommonConfig,
  getStylesConfig,
} from '@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs';
import { logger } from '@storybook/node-logger';

import { RuleSetRule, Configuration } from 'webpack';

function isDirectory(assetPath: string) {
  try {
    return fs.statSync(assetPath).isDirectory();
  } catch (e) {
    return false;
  }
}

function getAssetsParts(resolvedAssetPath: Path, assetPath: Path) {
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

function isStylingRule(rule: RuleSetRule) {
  const { test } = rule;

  if (!test) {
    return false;
  }

  if (!(test instanceof RegExp)) {
    return false;
  }

  return test.test('.css') || test.test('.scss') || test.test('.sass');
}

export function filterOutStylingRules(config: Configuration) {
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

// todo add type
export function getAngularCliParts(cliWebpackConfigOptions: any) {
  try {
    return {
      cliCommonConfig: getCommonConfig(cliWebpackConfigOptions),
      cliStyleConfig: getStylesConfig(cliWebpackConfigOptions),
    };
  } catch (e) {
    logger.warn("Failed to load the Angular CLI config. Using Storybook's default config instead.");
    logger.warn(e);
    return null;
  }
}

// todo fix any
export function normalizeAssetPatterns(assetPatterns: any, dirToSearch: Path, sourceRoot: Path) {
  if (!assetPatterns || !assetPatterns.length) {
    return [];
  }

  // todo fix any
  return assetPatterns.map((assetPattern: any) => {
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
