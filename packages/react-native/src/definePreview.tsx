import type { ComponentType } from 'react';

import { definePreview as definePreviewBase } from 'storybook/internal/csf';
import type {
  PreviewAddon,
  AddonTypes,
  InferTypes,
  Meta,
  Preview,
  Story,
} from 'storybook/internal/csf';
import type {
  Args,
  ArgsStoryFn,
  ComponentAnnotations,
  DecoratorFunction,
  ProjectAnnotations,
  Renderer,
  StoryAnnotations,
} from 'storybook/internal/types';

import type { SetOptional, Simplify, UnionToIntersection, RemoveIndexSignature } from 'type-fest';

import type { ReactRenderer } from '@storybook/react';

import * as rnEntryPreview from './entry-preview';

// ---------------------------------------------------------------------------
// Types — simplified from @storybook/react's ReactPreview/ReactMeta/ReactStory
// ---------------------------------------------------------------------------

// React Native uses ReactRenderer as its renderer type
type RNRenderer = ReactRenderer;

/** Extracts and unions all args types from an array of decorators. */
type DecoratorsArgs<TRenderer extends Renderer, Decorators> = UnionToIntersection<
  Decorators extends DecoratorFunction<TRenderer, infer TArgs> ? TArgs : unknown
>;

type InferArgs<TArgs, T, Decorators> = Simplify<
  TArgs & Simplify<RemoveIndexSignature<DecoratorsArgs<RNRenderer & T, Decorators>>>
>;

type InferRNTypes<T, TArgs, Decorators> = RNRenderer &
  T & { args: Simplify<InferArgs<TArgs, T, Decorators>> };

// @ts-ignore meta() return type is intentionally narrowed from base Preview
export interface RNPreview<T extends AddonTypes> extends Preview<RNRenderer & T> {
  type<R>(): RNPreview<T & R>;

  meta<
    TArgs extends Args,
    Decorators extends DecoratorFunction<RNRenderer & T, any>,
    TMetaArgs extends Partial<TArgs & T['args']>,
  >(
    meta: {
      render?: ArgsStoryFn<RNRenderer & T, TArgs & T['args']>;
      component?: ComponentType<TArgs>;
      decorators?: Decorators | Decorators[];
      args?: TMetaArgs;
    } & Omit<
      ComponentAnnotations<RNRenderer & T, TArgs>,
      'decorators' | 'component' | 'args' | 'render'
    >
  ): RNMeta<
    InferRNTypes<T, TArgs, Decorators>,
    Omit<ComponentAnnotations<InferRNTypes<T, TArgs, Decorators>>, 'args'> & {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      args: Partial<TArgs> extends TMetaArgs ? {} : TMetaArgs;
    }
  >;
}

export interface RNMeta<
  T extends RNRenderer,
  MetaInput extends ComponentAnnotations<T>,
> extends Meta<T, MetaInput> {
  // Overload: render function (no args needed)
  story<
    TInput extends
      | (() => RNRenderer['storyResult'])
      | (StoryAnnotations<T, T['args']> & {
          render: () => RNRenderer['storyResult'];
        }),
  >(
    story: TInput
  ): RNStory<T, TInput extends () => RNRenderer['storyResult'] ? { render: TInput } : TInput>;

  // Overload: story with args/config
  story<
    TInput extends Simplify<
      StoryAnnotations<
        T,
        T['args'],
        SetOptional<T['args'], keyof T['args'] & keyof MetaInput['args']>
      >
    >,
  >(
    story: TInput
  ): RNStory<T, TInput>;

  // Overload: no-arg story (only when all required args are in meta)
  story(
    ..._args: Partial<T['args']> extends SetOptional<
      T['args'],
      keyof T['args'] & keyof MetaInput['args']
    >
      ? []
      : [never]
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  ): RNStory<T, {}>;
}

export interface RNStory<
  T extends RNRenderer,
  TInput extends StoryAnnotations<T, T['args']>,
> extends Story<T, TInput> {
  Component: ComponentType<Partial<T['args']>>;
}

// ---------------------------------------------------------------------------
// RN render function
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
  input: { addons: Addons } & ProjectAnnotations<RNRenderer & InferTypes<Addons>>
): RNPreview<RNRenderer & InferTypes<Addons>> {
  const preview = definePreviewBase({
    ...input,
    addons: [rnEntryPreview, { render }, ...(input.addons ?? [])],
  }) as unknown as RNPreview<RNRenderer & InferTypes<Addons>>;

  // Spread userConfig for Start.tsx compat (composeConfigs reads fields directly)
  const { addons, ...userConfig } = input;
  Object.assign(preview, userConfig);

  // Wrap meta() for RN-specific behaviors
  const origMeta = preview.meta.bind(preview);
  preview.meta = (_input) => {
    const meta = origMeta(_input);

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
    meta.story = (__input: any) => {
      const story = origStory(__input);

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
