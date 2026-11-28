import type { Meta, ReactRenderer } from '@storybook/react';
import {
  composeConfigs,
  composeStories as originalComposeStories,
  composeStory as originalComposeStory,
  setDefaultProjectAnnotations,
  setProjectAnnotations as originalSetProjectAnnotations,
} from 'storybook/internal/preview-api';
import type {
  Args,
  ComposedStoryFn,
  NamedOrDefaultProjectAnnotations,
  NormalizedProjectAnnotations,
  ProjectAnnotations,
  Store_CSFExports,
  StoriesWithPartialProps,
  StoryAnnotationsOrFn,
} from 'storybook/internal/types';

import * as rnEntryPreview from './entry-preview';
import { render } from './render';

/**
 * The annotations every portable story starts from: the same React Native defaults that
 * `definePreview` gives CSF factories. Unlike `@storybook/react`'s portable stories they don't
 * include a react-dom `renderToCanvas`, so they don't depend on react-dom.
 */
const INTERNAL_DEFAULT_PROJECT_ANNOTATIONS: ProjectAnnotations<ReactRenderer> = composeConfigs([
  rnEntryPreview,
  { render },
]);

/**
 * Function that sets the globalConfig of your storybook. The global config is the preview module of
 * your .rnstorybook folder.
 *
 * It should be run a single time, so that your global config (e.g. decorators) is applied to your
 * stories when using `composeStories` or `composeStory`.
 *
 * Example:
 *
 * ```jsx
 * // setup-file.js
 * import { setProjectAnnotations } from '@storybook/react-native';
 * import projectAnnotations from './.rnstorybook/preview';
 *
 * setProjectAnnotations(projectAnnotations);
 * ```
 *
 * @param projectAnnotations - E.g. (import * as projectAnnotations from '../.rnstorybook/preview')
 */
export function setProjectAnnotations(
  projectAnnotations:
    | NamedOrDefaultProjectAnnotations<any>
    | NamedOrDefaultProjectAnnotations<any>[]
): NormalizedProjectAnnotations<ReactRenderer> {
  setDefaultProjectAnnotations(INTERNAL_DEFAULT_PROJECT_ANNOTATIONS);

  return originalSetProjectAnnotations(
    projectAnnotations
  ) as NormalizedProjectAnnotations<ReactRenderer>;
}

/**
 * Function that will receive a story along with meta (e.g. a default export from a .stories file)
 * and optionally projectAnnotations e.g. (import * as projectAnnotations from
 * '../.rnstorybook/preview') and will return a composed component that has all
 * args/parameters/decorators/etc combined and applied to it.
 *
 * It's very useful for reusing a story in scenarios outside of Storybook like unit testing.
 *
 * Example:
 *
 * ```jsx
 * import { render, screen } from '@testing-library/react-native';
 * import { composeStory } from '@storybook/react-native';
 * import Meta, { Primary as PrimaryStory } from './Button.stories';
 *
 * const Primary = composeStory(PrimaryStory, Meta);
 *
 * test('renders primary button with Hello World', async () => {
 *   await render(<Primary title="Hello world" />);
 *   expect(screen.getByText(/Hello world/i)).toBeTruthy();
 * });
 * ```
 *
 * @param story
 * @param componentAnnotations - E.g. (import Meta from './Button.stories')
 * @param [projectAnnotations] - E.g. (import * as projectAnnotations from '../.rnstorybook/preview')
 *   this can be applied automatically if you use `setProjectAnnotations` in your setup files.
 * @param [exportsName] - In case your story does not contain a name and you want it to have a name.
 */
export function composeStory<TArgs extends Args = Args>(
  story: StoryAnnotationsOrFn<ReactRenderer, TArgs>,
  componentAnnotations: Meta<TArgs | any>,
  projectAnnotations?: ProjectAnnotations<ReactRenderer>,
  exportsName?: string
): ComposedStoryFn<ReactRenderer, Partial<TArgs>> {
  return originalComposeStory<ReactRenderer, TArgs>(
    story,
    componentAnnotations,
    projectAnnotations,
    globalThis.globalProjectAnnotations ?? INTERNAL_DEFAULT_PROJECT_ANNOTATIONS,
    exportsName
  );
}

/**
 * Function that will receive a stories import (e.g. `import * as stories from './Button.stories'`)
 * and optionally projectAnnotations (e.g. `import * as projectAnnotations from
 * '../.rnstorybook/preview'`) and will return an object containing all the stories passed, but now
 * as a composed component that has all args/parameters/decorators/etc combined and applied to it.
 *
 * It's very useful for reusing stories in scenarios outside of Storybook like unit testing.
 *
 * Example:
 *
 * ```jsx
 * import { render, screen } from '@testing-library/react-native';
 * import { composeStories } from '@storybook/react-native';
 * import * as stories from './Button.stories';
 *
 * const { Primary, Secondary } = composeStories(stories);
 *
 * test('renders primary button with Hello World', async () => {
 *   await render(<Primary title="Hello world" />);
 *   expect(screen.getByText(/Hello world/i)).toBeTruthy();
 * });
 * ```
 *
 * @param csfExports - E.g. (import * as stories from './Button.stories')
 * @param [projectAnnotations] - E.g. (import * as projectAnnotations from '../.rnstorybook/preview')
 *   this can be applied automatically if you use `setProjectAnnotations` in your setup files.
 */
export function composeStories<TModule extends Store_CSFExports<ReactRenderer, any>>(
  csfExports: TModule,
  projectAnnotations?: ProjectAnnotations<ReactRenderer>
): Omit<StoriesWithPartialProps<ReactRenderer, TModule>, keyof Store_CSFExports> {
  // Storybook's composeStories is typed loosely (it returns `{}`), so give the result the same
  // per-story types as `@storybook/react`'s composeStories.
  return originalComposeStories(csfExports, projectAnnotations, composeStory) as Omit<
    StoriesWithPartialProps<ReactRenderer, TModule>,
    keyof Store_CSFExports
  >;
}
