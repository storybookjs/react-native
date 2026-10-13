import * as path from 'path';
import {
  DOCUMENTED_PREVIEW_IMPORT,
  isDocumentedPreviewImport,
  rewriteDocumentedPreviewImport,
} from './previewAlias';

describe('previewAlias', () => {
  const configPath = '/project/.rnstorybook';

  test('matches the documented specifier with and without extensions', () => {
    expect(isDocumentedPreviewImport(DOCUMENTED_PREVIEW_IMPORT)).toBe(true);
    expect(isDocumentedPreviewImport('#.storybook/preview.ts')).toBe(true);
    expect(isDocumentedPreviewImport('#.storybook/preview.tsx')).toBe(true);
    expect(isDocumentedPreviewImport('#.storybook/main')).toBe(false);
    expect(isDocumentedPreviewImport('../../.rnstorybook/preview')).toBe(false);
  });

  test('rewrites documented preview imports to configPath/preview', () => {
    expect(rewriteDocumentedPreviewImport(DOCUMENTED_PREVIEW_IMPORT, configPath)).toBe(
      path.join(configPath, 'preview')
    );
    expect(rewriteDocumentedPreviewImport('#.storybook/preview.tsx', configPath)).toBe(
      path.join(configPath, 'preview')
    );
  });

  test('leaves other module names unchanged', () => {
    expect(rewriteDocumentedPreviewImport('react', configPath)).toBe('react');
    expect(rewriteDocumentedPreviewImport('../../.rnstorybook/preview', configPath)).toBe(
      '../../.rnstorybook/preview'
    );
  });
});
