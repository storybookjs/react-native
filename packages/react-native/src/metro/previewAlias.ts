import * as path from 'path';

/** CSF Next stories import this; bundlers rewrite it to `{configPath}/preview`. */
export const DOCUMENTED_PREVIEW_IMPORT = '#.storybook/preview';

const DOCUMENTED_PREVIEW = /^#\.storybook\/preview(\.(js|jsx|mjs|cjs|ts|tsx))?$/;

export function isDocumentedPreviewImport(moduleName: string): boolean {
  return DOCUMENTED_PREVIEW.test(moduleName);
}

export function rewriteDocumentedPreviewImport(moduleName: string, configPath: string): string {
  if (!isDocumentedPreviewImport(moduleName)) {
    return moduleName;
  }

  return path.join(configPath, 'preview');
}
