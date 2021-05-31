import { Annotations, Args as DefaultArgs, BaseMeta, BaseStory } from '@storybook/addons';
import { ComponentProps, ComponentType, JSXElementConstructor, ReactElement } from 'react';

export type StoryFnReactReturnType = ReactElement<unknown>;

export type { Args, ArgTypes, Parameters, StoryContext } from '@storybook/addons';

type ReactComponent = ComponentType<any>;
type ReactReturnType = StoryFnReactReturnType;

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<Args = DefaultArgs> = BaseMeta<ReactComponent> &
  Annotations<Args, ReactReturnType>;

/**
 * Story function that represents a component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<Args = DefaultArgs> = BaseStory<Args, ReactReturnType> &
  Annotations<Args, ReactReturnType>;

/**
 * For the common case where a component's stories are simple components that receives args as props:
 *
 * ```tsx
 * export default { ... } as ComponentMeta<typeof Button>;
 * ```
 */
export type ComponentMeta<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
> = Meta<ComponentProps<T>>;

/**
 * For the common case where a story is a simple component that receives args as props:
 *
 * ```tsx
 * const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />
 * ```
 */
export type ComponentStory<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
> = Story<ComponentProps<T>>;
