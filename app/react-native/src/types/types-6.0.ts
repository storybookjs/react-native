import { ComponentProps, ComponentType, JSXElementConstructor, ReactElement } from 'react';
import type {
  Args,
  ComponentAnnotations,
  StoryAnnotations,
  AnnotatedStoryFn,
} from '@storybook/csf';

export type StoryFnReactReturnType = ReactElement<unknown>;

export type { Args, ArgTypes, Parameters, StoryContext } from '@storybook/addons';

export type ReactNativeFramework = {
  component: ComponentType<any>;
  storyResult: StoryFnReactReturnType;
};

/**
 * For the common case where a component's stories are simple components that receives args as props:
 *
 * ```tsx
 * export default { ... } as ComponentMeta<typeof Button>;
 * ```
 */
export type ComponentMeta<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  Meta<ComponentProps<T>>;

/**
 * For the common case where a (CSFv2) story is a simple component that receives args as props:
 *
 * ```tsx
 * const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />
 * ```
 */
export type ComponentStoryFn<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  StoryFn<ComponentProps<T>>;

/**
 * For the common case where a (CSFv3) story is a simple component that receives args as props:
 *
 * ```tsx
 * const MyStory: ComponentStory<typeof Button> = {
 *   args: { buttonArg1: 'val' },
 * }
 * ```
 */
export type ComponentStoryObj<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  StoryObj<ComponentProps<T>>;

/**
 * For the common case where a (CSFv2) story is a simple component that receives args as props:
 *
 * ```tsx
 * const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />
 * ```
 *
 * NOTE: this is an alias for `ComponentStoryFn`.
 * In Storybook v7, `ComponentStory` will alias `ComponentStoryObj`
 */
export type ComponentStory<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  Story<ComponentProps<T>>;

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<TArgs = Args> = ComponentAnnotations<ReactNativeFramework, TArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TArgs = Args> = AnnotatedStoryFn<ReactNativeFramework, TArgs>;

/**
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<TArgs = Args> = StoryAnnotations<ReactNativeFramework, TArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 *
 * NOTE that in Storybook 7.0, this type will be renamed to `StoryFn` and replaced by the current `StoryObj` type.
 *
 */
export type Story<TArgs = Args> = StoryFn<TArgs>;
