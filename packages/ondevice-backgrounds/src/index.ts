import type { DecoratorFunction } from 'storybook/internal/types';

/**
 * @deprecated Backgrounds are built into `@storybook/react-native`. Use `parameters.backgrounds.options`
 * and `initialGlobals.backgrounds` instead of `values` and `default`.
 */
export interface Background {
  name: string;
  value: string;
}

/**
 * @deprecated Backgrounds are built into `@storybook/react-native`, which applies them without a
 * decorator. This decorator now renders the story unchanged so backgrounds aren't applied twice.
 * Remove it from your preview decorators.
 */
export const withBackgrounds: DecoratorFunction<any> = (storyFn) => storyFn();
