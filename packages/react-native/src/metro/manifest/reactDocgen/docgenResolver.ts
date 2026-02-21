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
