import {
  composeStory,
  composeConfigs,
  normalizeProjectAnnotations,
} from 'storybook/internal/preview-api';
import { combineTags } from 'storybook/internal/csf';
import type {
  ProjectAnnotations,
  NormalizedProjectAnnotations,
  ComponentAnnotations,
  StoryAnnotations,
} from 'storybook/internal/types';
import type { ReactRenderer } from '@storybook/react';

import * as rnEntryPreview from './entry-preview';

// Helpers inlined from storybook internals
const normalizeArrays = <T,>(array: T[] | T | undefined): T[] =>
  Array.isArray(array) ? array : array ? [array] : [];

const combineParameters = (...parameterSets: (Record<string, any> | undefined)[]): any => {
  const defined = parameterSets.filter(Boolean) as Record<string, any>[];
  const mergeKeys: Record<string, boolean> = {};

  const combined = defined.reduce<Record<string, any>>((acc, parameters) => {
    Object.entries(parameters).forEach(([key, value]) => {
      const existing = acc[key];
      if (Array.isArray(value) || typeof existing === 'undefined') {
        acc[key] = value;
      } else if (isPlainObject(value) && isPlainObject(existing)) {
        mergeKeys[key] = true;
      } else if (typeof value !== 'undefined') {
        acc[key] = value;
      }
    });
    return acc;
  }, {});

  Object.keys(mergeKeys).forEach((key) => {
    const mergeValues = defined.map((p) => p[key]).filter((v) => typeof v !== 'undefined');
    if (mergeValues.every(isPlainObject)) {
      combined[key] = combineParameters(...mergeValues);
    } else {
      combined[key] = mergeValues[mergeValues.length - 1];
    }
  });

  return combined;
};

function isPlainObject(obj: unknown): obj is Record<string, unknown> {
  return obj != null && typeof obj === 'object' && !Array.isArray(obj);
}

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
// definePreview – RN-specific (no getCoreAnnotations, no web addons)
// ---------------------------------------------------------------------------
type PreviewInput = ProjectAnnotations<ReactRenderer> & {
  addons?: ProjectAnnotations<ReactRenderer>[];
};

interface RNPreview {
  readonly _tag: 'Preview';
  input: PreviewInput;
  readonly composed: NormalizedProjectAnnotations<ReactRenderer>;
  meta(input: ComponentAnnotations<ReactRenderer, any>): RNMeta;
}

interface RNMeta {
  readonly _tag: 'Meta';
  input: ComponentAnnotations<ReactRenderer, any>;
  preview: RNPreview;
  // Direct property access for prepareStories compatibility
  readonly title: string | undefined;
  readonly includeStories: any;
  readonly excludeStories: any;
  story(input?: any): RNStory;
}

interface RNStory {
  readonly _tag: 'Story';
  input: StoryAnnotations<ReactRenderer, any>;
  meta: RNMeta;
  readonly composed: {
    args: any;
    argTypes: any;
    parameters: any;
    id: string;
    tags: string[];
    name: string;
    globals: any;
  };
  readonly play: ((...args: any[]) => any) | undefined;
  Component: any;
  run(context?: any): Promise<void>;
  extend(input: StoryAnnotations<ReactRenderer, any>): RNStory;
  test(name: string, fn: any): void;
  test(name: string, annotations: any, fn: any): void;
  __compose: () => any;
  __children: RNStory[];
}

function defineStory(input: StoryAnnotations<ReactRenderer, any>, meta: RNMeta): RNStory {
  let composed: any;

  const compose = () => {
    if (!composed) {
      // Shallow-copy meta.input because composeStory mutates componentAnnotations.title
      // (sets it to DEFAULT_STORY_TITLE when undefined). Without the copy, stories relying
      // on auto-title from the file path would all get grouped under "Composed Story".
      composed = composeStory(input, { ...meta.input }, undefined, meta.preview.composed);
    }
    return composed;
  };

  const __children: RNStory[] = [];

  const story: RNStory = {
    _tag: 'Story',
    input,
    meta,
    __compose: compose,
    __children,

    get composed() {
      const c = compose();
      const { args, argTypes, parameters, id, tags, globals, storyName: name } = c;
      return { args, argTypes, parameters, id, tags, name, globals };
    },

    // Return undefined when no user play function exists (not a noop like base storybook)
    // This lets `typeof story.play === 'function'` correctly detect user-defined play
    get play() {
      const userPlay = input.play ?? meta.input?.play;
      return userPlay ?? undefined;
    },

    async run(context?: any) {
      await compose().run(context);
    },

    test(name: string, overridesOrTestFn: any, testFn?: any) {
      const annotations = typeof overridesOrTestFn !== 'function' ? overridesOrTestFn : {};
      const testFunction = typeof overridesOrTestFn !== 'function' ? testFn : overridesOrTestFn;

      const play = async (context: any) => {
        if (story.play) await story.play(context);
        await testFunction(context);
      };

      const test = story.extend({
        ...annotations,
        name,
        tags: ['test', '!autodocs', ...(annotations.tags ?? [])],
        play,
      });

      __children.push(test);
      return test;
    },

    extend(input2: StoryAnnotations<ReactRenderer, any>) {
      return defineStory(
        {
          ...input,
          ...input2,
          args: { ...(input.args || {}), ...(input2.args as any) },
          argTypes: combineParameters(input.argTypes, input2.argTypes),
          afterEach: [
            ...normalizeArrays(input?.afterEach ?? []),
            ...normalizeArrays(input2.afterEach ?? []),
          ],
          beforeEach: [
            ...normalizeArrays(input?.beforeEach ?? []),
            ...normalizeArrays(input2.beforeEach ?? []),
          ],
          decorators: [
            ...normalizeArrays(input?.decorators ?? []),
            ...normalizeArrays(input2.decorators ?? []),
          ] as any,
          globals: { ...(input as any).globals, ...(input2 as any).globals },
          loaders: [
            ...normalizeArrays(input?.loaders ?? []),
            ...normalizeArrays(input2.loaders ?? []),
          ],
          parameters: combineParameters(input.parameters, input2.parameters),
          tags: combineTags(...(input.tags ?? []), ...(input2.tags ?? [])),
        },
        meta
      );
    },

    Component: undefined as any,
  };

  return story;
}

function defineMeta(input: ComponentAnnotations<ReactRenderer, any>, preview: RNPreview): RNMeta {
  const metaInput = {
    ...input,
    parameters: { ...input.parameters, csfFactory: true },
  };

  const meta: RNMeta = {
    _tag: 'Meta',
    input: metaInput,
    preview,

    // Direct property access so prepareStories can read these without workarounds
    get title() {
      return metaInput.title;
    },
    get includeStories() {
      return metaInput.includeStories;
    },
    get excludeStories() {
      return metaInput.excludeStories;
    },

    story(storyInput: any = {}) {
      const normalized = typeof storyInput === 'function' ? { render: storyInput } : storyInput;
      const story = defineStory(normalized, meta);
      // Set Component for portable story compat (same as @storybook/react)
      story.Component = story.__compose();
      return story;
    },
  };

  return meta;
}

export function definePreview(input: PreviewInput): RNPreview {
  let composed: NormalizedProjectAnnotations<ReactRenderer> | undefined;

  const { addons, ...userConfig } = input;

  const preview: RNPreview = {
    // Spread user's config fields (parameters, decorators, etc.) at the top level
    // so composeConfigs can read them directly without unwrapping.
    ...userConfig,

    _tag: 'Preview',
    input,

    get composed() {
      if (composed) return composed;

      composed = normalizeProjectAnnotations(
        composeConfigs<ReactRenderer>([
          // RN-specific annotations (renderer, argTypes enhancers, etc.)
          rnEntryPreview,
          // Include render function so composeStory works
          { render },
          // User-supplied addons
          ...(addons ?? []),
          // User's own config (parameters, decorators, etc.)
          userConfig,
        ])
      );

      return composed;
    },

    meta(metaInput: ComponentAnnotations<ReactRenderer, any>) {
      return defineMeta(metaInput, preview);
    },
  };

  // Set global so portable stories (composeStory without explicit config) work
  globalThis.globalProjectAnnotations = preview.composed;

  return preview;
}
