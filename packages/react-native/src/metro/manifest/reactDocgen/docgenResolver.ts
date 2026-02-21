/**
 * Module resolution for react-docgen's importer.
 *
 * Adapted from @storybook/react's internal componentManifest utilities,
 * which are not exported as public API (bundled into preset.js).
 */
import { extname } from 'node:path';
import { supportedExtensions } from 'storybook/internal/common';
import resolve from 'resolve';

export class ReactDocgenResolveError extends Error {
  readonly code = 'MODULE_NOT_FOUND';

  constructor(filename: string) {
    super(`'${filename}' was ignored by react-docgen.`);
  }
}

export function defaultLookupModule(filename: string, basedir: string): string {
  const resolveOptions = {
    basedir,
    extensions: supportedExtensions,
    includeCoreModules: false,
  };

  try {
    return resolve.sync(filename, resolveOptions);
  } catch (error) {
    // Fallback: try resolving .js/.jsx as .ts/.tsx for TypeScript source files
    const ext = extname(filename);
    let newFilename: string;

    switch (ext) {
      case '.js':
      case '.mjs':
      case '.cjs':
        newFilename = `${filename.slice(0, -2)}ts`;
        break;
      case '.jsx':
        newFilename = `${filename.slice(0, -3)}tsx`;
        break;
      default:
        throw error;
    }

    return resolve.sync(newFilename, {
      ...resolveOptions,
      extensions: [],
    });
  }
}
