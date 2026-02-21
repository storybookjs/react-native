/**
 * React-docgen integration for extracting component prop information.
 *
 * Adapted from @storybook/react's internal componentManifest utilities,
 * which are not exported as public API (bundled into preset.js).
 *
 * Key difference from the web version: the docgen importer does NOT remap
 * `react-native` imports to `react-native-web`, since stories run on-device.
 */
import { dirname } from 'node:path';
import { babelParse, types as t } from 'storybook/internal/babel';
import { supportedExtensions } from 'storybook/internal/common';

import {
  type Documentation,
  builtinHandlers as docgenHandlers,
  builtinResolvers as docgenResolver,
  makeFsImporter,
  parse,
} from 'react-docgen';
import * as TsconfigPaths from 'tsconfig-paths';

import { type ComponentRef } from './getComponentImports';
import { extractJSDocInfo } from './jsdocTags';
import actualNameHandler from './reactDocgen/actualNameHandler';
import { ReactDocgenResolveError } from './reactDocgen/docgenResolver';
import exportNameHandler from './reactDocgen/exportNameHandler';
import { cached, cachedReadFileSync, cachedResolveImport, findTsconfigPath } from './utils';

export type DocObj = Documentation & {
  actualName: string;
  definedInFile: string;
  exportName?: string;
};

const defaultHandlers = Object.values(docgenHandlers).map((handler) => handler);
const defaultResolver = new docgenResolver.FindExportedDefinitionsResolver();
const handlers = [...defaultHandlers, actualNameHandler, exportNameHandler];

export function getMatchingDocgen(docgens: DocObj[], component: ComponentRef) {
  if (docgens.length === 0) {
    return;
  }
  if (docgens.length === 1) {
    return docgens[0];
  }

  const matchingDocgen =
    docgens.find((docgen) =>
      [component.importName, component.localImportName].includes(docgen.exportName)
    ) ??
    docgens.find(
      (docgen) =>
        [component.importName, component.localImportName, component.componentName].includes(
          docgen.displayName
        ) ||
        [component.importName, component.localImportName, component.componentName].includes(
          docgen.actualName
        )
    );

  return matchingDocgen ?? docgens[0];
}

export function matchPath(id: string, basedir?: string) {
  basedir ??= process.cwd();
  const tsconfig = getTsConfig(basedir);

  if (tsconfig.resultType === 'success') {
    const match = TsconfigPaths.createMatchPath(tsconfig.absoluteBaseUrl, tsconfig.paths, [
      'browser',
      'module',
      'main',
    ]);
    return match(id, undefined, undefined, supportedExtensions) ?? id;
  }
  return id;
}

export const getTsConfig = cached(
  (cwd: string) => {
    const tsconfigPath = findTsconfigPath(cwd);
    return TsconfigPaths.loadConfig(tsconfigPath);
  },
  { name: 'getTsConfig' }
);

export const parseWithReactDocgen = cached(
  (code: string, path: string) => {
    return parse(code, {
      resolver: defaultResolver,
      handlers,
      importer: getReactDocgenImporter(),
      filename: path,
    }) as DocObj[];
  },
  { key: (_code, path) => path, name: 'parseWithReactDocgen' }
);

const getExportPaths = cached(
  (code: string, filePath: string) => {
    let ast;
    try {
      ast = babelParse(code);
    } catch {
      return [];
    }

    const basedir = dirname(filePath);
    const body = ast.program.body;
    return body
      .flatMap((statement) =>
        t.isExportAllDeclaration(statement)
          ? [statement.source.value]
          : t.isExportNamedDeclaration(statement) && !!statement.source && !statement.declaration
            ? [statement.source.value]
            : []
      )
      .map((id) => matchPath(id, basedir))
      .flatMap((id) => {
        try {
          return [cachedResolveImport(id, { basedir })];
        } catch {
          return [];
        }
      });
  },
  { name: 'getExportPaths' }
);

const gatherDocgensForPath = cached(
  (
    path: string,
    depth: number
  ): {
    docgens: DocObj[];
    errors: { path: string; code: string; name: string; message: string }[];
  } => {
    if (path.includes('node_modules')) {
      return {
        docgens: [],
        errors: [
          {
            path,
            code: '/* File in node_modules */',
            name: 'Component file in node_modules',
            message:
              'Component files in node_modules are not supported. ' +
              'Configure TypeScript path aliases to map your package name to the source file instead.',
          },
        ],
      };
    }

    let code;
    try {
      code = cachedReadFileSync(path, 'utf-8') as string;
    } catch {
      return {
        docgens: [],
        errors: [
          {
            path,
            code: '/* File not found or unreadable */',
            name: 'Component file could not be read',
            message: `Could not read the component file located at "${path}".`,
          },
        ],
      };
    }

    // Guard against infinite loops from circular re-exports
    if (depth > 5) {
      return {
        docgens: [],
        errors: [
          {
            path,
            code,
            name: 'Max re-export depth exceeded',
            message:
              'Traversal stopped after 5 steps while following re-exports. ' +
              'Try importing the component file directly or reducing re-export hops.',
          },
        ],
      };
    }

    const exportPaths = getExportPaths(code, path).map((p) => gatherDocgensForPath(p, depth + 1));
    const docgens = exportPaths.flatMap((r) => r.docgens);
    const errors = exportPaths.flatMap((r) => r.errors);

    try {
      return {
        docgens: [...parseWithReactDocgen(code, path), ...docgens],
        errors,
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return {
        docgens,
        errors: [
          {
            path,
            code,
            name: 'No component definition found',
            message,
          },
          ...errors,
        ],
      };
    }
  },
  { name: 'gatherDocgensWithTrace', key: (filePath) => filePath }
);

export const getReactDocgen = cached(
  (
    path: string,
    component: ComponentRef
  ):
    | { type: 'success'; data: DocObj }
    | { type: 'error'; error: { name: string; message: string } } => {
    const { docgens, errors } = gatherDocgensForPath(path, 0);

    const docgen = getMatchingDocgen(docgens, component);

    if (!docgen) {
      const error = {
        name: errors.at(-1)?.name ?? 'No component definition found',
        message: errors
          .map((e) => `File: ${e.path}\nError:\n${e.message}\nCode:\n${e.code}`)
          .join('\n\n'),
      };
      return { type: 'error', error };
    }
    return { type: 'success', data: docgen };
  },
  { name: 'getReactDocgen', key: (path, component) => path + JSON.stringify(component) }
);

/**
 * React Native docgen importer.
 * Unlike the web version, this does NOT remap react-native to react-native-web.
 */
export function getReactDocgenImporter() {
  return makeFsImporter((filename, basedir) => {
    const mappedFilenameByPaths = matchPath(filename, basedir);
    const result = cachedResolveImport(mappedFilenameByPaths, { basedir });

    if (supportedExtensions.find((ext) => result.endsWith(ext))) {
      return result;
    }

    throw new ReactDocgenResolveError(filename);
  });
}

export function getImportTag(docgen: { description?: string }) {
  const jsdocComment = docgen?.description;
  const tags = jsdocComment ? extractJSDocInfo(jsdocComment).tags : undefined;
  return tags?.import?.[0];
}
