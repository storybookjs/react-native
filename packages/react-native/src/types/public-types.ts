import type {
  AnnotatedStoryFn,
  Args,
  ArgsFromMeta,
  ArgsStoryFn,
  ComponentAnnotations,
  DecoratorFunction,
  LoaderFunction,
  StoryAnnotations,
  StoryContext as GenericStoryContext,
  StrictArgs,
  ProjectAnnotations,
} from '@storybook/types';
import type { Renderer } from '@storybook/csf';
import type { ComponentProps, ComponentType } from 'react';
import type { SetOptional, Simplify } from 'type-fest';

import { RenderContext } from '@storybook/types';

export interface PreviewError {
  message?: string;
  stack?: string;
}

export interface RequireContext {
  keys: () => string[];
  (id: string): any;
  resolve(id: string): string;
}

export type Loadable = RequireContext | RequireContext[] | LoaderFunction;

export type { RenderContext };

// The function used by a framework to render story to the DOM
export type RenderStoryFunction = (context: RenderContext) => void;

export type StoryFnReactReturnType = JSX.Element;

export interface ReactNativeRenderer extends Renderer {
  component: ComponentType<any>;
  storyResult: StoryFnReactReturnType;
}

export type { Args, ArgTypes, Parameters, StrictArgs } from '@storybook/types';

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<TCmpOrArgs = Args> = [TCmpOrArgs] extends [ComponentType<any>]
  ? ComponentAnnotations<ReactNativeRenderer, ComponentProps<TCmpOrArgs>>
  : ComponentAnnotations<ReactNativeRenderer, TCmpOrArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TCmpOrArgs = Args> = [TCmpOrArgs] extends [ComponentType<any>]
  ? AnnotatedStoryFn<ReactNativeRenderer, ComponentProps<TCmpOrArgs>>
  : AnnotatedStoryFn<ReactNativeRenderer, TCmpOrArgs>;

/**
 * Story object that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<TMetaOrCmpOrArgs = Args> = [TMetaOrCmpOrArgs] extends [
  {
    render?: ArgsStoryFn<ReactNativeRenderer, any>;
    component?: infer Component;
    args?: infer DefaultArgs;
  }
]
  ? Simplify<
      (Component extends ComponentType<any> ? ComponentProps<Component> : unknown) &
        ArgsFromMeta<ReactNativeRenderer, TMetaOrCmpOrArgs>
    > extends infer TArgs
    ? StoryAnnotations<
        ReactNativeRenderer,
        AddMocks<TArgs, DefaultArgs>,
        SetOptional<TArgs, keyof TArgs & keyof DefaultArgs>
      >
    : never
  : TMetaOrCmpOrArgs extends ComponentType<any>
  ? StoryAnnotations<ReactNativeRenderer, ComponentProps<TMetaOrCmpOrArgs>>
  : StoryAnnotations<ReactNativeRenderer, TMetaOrCmpOrArgs>;

// This performs a downcast to function types that are mocks, when a mock fn is given to meta args.
type AddMocks<TArgs, DefaultArgs> = Simplify<{
  [T in keyof TArgs]: T extends keyof DefaultArgs
    ? DefaultArgs[T] extends (...args: any) => any & { mock: {} } // allow any function with a mock object
      ? DefaultArgs[T]
      : TArgs[T]
    : TArgs[T];
}>;

export type Decorator<TArgs = StrictArgs> = DecoratorFunction<ReactNativeRenderer, TArgs>;
export type Loader<TArgs = StrictArgs> = LoaderFunction<ReactNativeRenderer, TArgs>;
export type StoryContext<TArgs = StrictArgs> = GenericStoryContext<ReactNativeRenderer, TArgs>;
export type Preview = ProjectAnnotations<ReactNativeRenderer>;
