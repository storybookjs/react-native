import type { ReactRenderer } from '@storybook/react';
import type { ArgsStoryFn } from 'storybook/internal/types';

/**
 * The default `render` for React Native stories: renders the meta's `component` with the story's
 * args. Used on device, by CSF factories and by portable stories.
 */
export const render: ArgsStoryFn<ReactRenderer> = (args, context) => {
  const { id, component: Component } = context;

  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  return <Component {...args} />;
};
