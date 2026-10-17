import type { StorybookContext } from '@storybook/mcp';
import { buildIndex } from './buildIndex';

export type ManifestProvider = NonNullable<StorybookContext['manifestProvider']>;

/**
 * Builds the components manifest the `@storybook/mcp` docs tools read, from the story files on
 * disk. Docgen runs in Node, so no device or bundler is needed.
 */
export function createManifestProvider(configPath: string): ManifestProvider {
  return async (_request, manifestPath) => {
    if (manifestPath.includes('docs.json')) {
      throw new Error('Docs manifest not available in React Native Storybook');
    }

    const { experimental_manifests } = await import('@storybook/react/preset');
    const index = await buildIndex({ configPath });
    const entries = Object.values(index.entries);
    const manifest = await experimental_manifests({}, { manifestEntries: entries });

    return JSON.stringify(manifest.components);
  };
}
