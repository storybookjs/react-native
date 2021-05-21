import { ComponentType, ReactElement } from 'react';
import { Args as DefaultArgs, Annotations, BaseMeta, BaseStory } from '@storybook/addons';

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
