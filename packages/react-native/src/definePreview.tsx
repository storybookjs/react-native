import { definePreview as definePreviewBase } from 'storybook/internal/csf';
import type { PreviewAddon, InferTypes, Preview } from 'storybook/internal/csf';
import type { ProjectAnnotations } from 'storybook/internal/types';
import type { ReactRenderer } from '@storybook/react';

import * as rnEntryPreview from './entry-preview';

// ---------------------------------------------------------------------------
// RN render function – same as what Start.tsx currently inlines
// ---------------------------------------------------------------------------
const render = (args: any, context: any) => {
  const { id, component: Component } = context;

  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  return <Component {...args} />;
};

// ---------------------------------------------------------------------------
// definePreview – RN-specific wrapper around base definePreview
// ---------------------------------------------------------------------------
export function definePreview<Addons extends PreviewAddon<never>[]>(
  input: { addons: Addons } & ProjectAnnotations<ReactRenderer & InferTypes<Addons>>
): Preview<ReactRenderer & InferTypes<Addons>> {
  const preview = definePreviewBase({
    ...input,
    addons: [rnEntryPreview, { render }, ...(input.addons ?? [])],
  }) as Preview<ReactRenderer & InferTypes<Addons>>;

  // Spread userConfig for Start.tsx compat (composeConfigs reads fields directly)
  const { addons, ...userConfig } = input;
  Object.assign(preview, userConfig);

  // Wrap meta() for RN-specific behaviors
  const origMeta = preview.meta.bind(preview);
  preview.meta = (metaInput: any) => {
    const meta = origMeta(metaInput);

    // Expose title/includeStories/excludeStories directly for prepareStories.
    // Base Meta only has these on `.input`, but prepareStories reads `meta.title`
    // and `isExportStory(key, meta)` destructures `{ includeStories, excludeStories }`.
    Object.defineProperties(meta, {
      title: { get: () => meta.input.title, enumerable: true, configurable: true },
      includeStories: {
        get: () => meta.input.includeStories,
        enumerable: true,
        configurable: true,
      },
      excludeStories: {
        get: () => meta.input.excludeStories,
        enumerable: true,
        configurable: true,
      },
    });

    // Wrap story() for RN-specific behaviors
    const origStory = meta.story.bind(meta);
    meta.story = (storyInput: any) => {
      const story = origStory(storyInput);

      // Lazy Component — avoids eager composeStory which mutates meta.input.title
      // to "Composed Story". On RN, prepareStories reads meta.title at runtime.
      Object.defineProperty(story, 'Component', {
        get: () => (story as any).__compose(),
        enumerable: true,
        configurable: true,
      });

      // play returns undefined (not noop) when no user play function.
      // Base returns `async () => {}`, making `typeof story.play === 'function'` always true.
      // RN needs `undefined` for play detection in prepareStories.
      Object.defineProperty(story, 'play', {
        get: () => (story.input.play ?? meta.input?.play) || undefined,
        enumerable: true,
        configurable: true,
      });

      return story;
    };

    return meta;
  };

  return preview;
}
