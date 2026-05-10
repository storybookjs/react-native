import { Platform } from 'react-native';
import {
  composeConfigs,
  addons as previewAddons,
  View as PreviewView,
  PreviewWithSelection,
  SelectionStore,
} from 'storybook/internal/preview-api';
import { addons as managerAddons } from 'storybook/manager-api';
import './polyfill';

import type { ReactRenderer } from '@storybook/react';
import { Channel } from 'storybook/internal/channels';
import type {
  ModuleExports,
  NormalizedProjectAnnotations,
  NormalizedStoriesSpecifier,
  ProjectAnnotations,
} from 'storybook/internal/types';
import { View } from './View';
import { prepareStories, type ReactNativeOptions } from './prepareStories';
export { prepareStories, type ReactNativeOptions } from './prepareStories';

type StoryEntry = NormalizedStoriesSpecifier & {
  req: {
    keys(): string[];
    (id: string): unknown;
  };
};

const createPreviewRoot = (): ReactRenderer['canvasElement'] =>
  ({
    component: () => <></>,
    canvasElement: null,
    mount: () => Promise.resolve({}),
    storyResult: null,
    T: null,
  }) as unknown as ReactRenderer['canvasElement'];

const getReactNativeProjectAnnotations = (getView: () => View | undefined) =>
  ({
    renderToCanvas: (context) => {
      getView()?._setStory(context.storyContext);
    },
    render: (args, context) => {
      const { id, component: Component } = context;

      if (!Component) {
        throw new Error(
          `Unable to render story ${id} as the component annotation is missing from the default export`
        );
      }

      return <Component {...args} />;
    },
  }) satisfies ProjectAnnotations<ReactRenderer>;

/**
 * Since we aren't supporting  these web addons yet in react native (or reimplement them) then we should disable them
 * to avoid running code for addons that are not supported.
 */
globalThis.FEATURES = Object.assign(globalThis.FEATURES ?? {}, {
  measure: false,
  outline: false,
  interactions: false,
  viewport: false,
  highlight: false,
  backgrounds: false,
});

// Note this is a workaround for setImmediate not being defined
if (Platform.OS === 'web' && typeof globalThis.setImmediate === 'undefined') {
  require('setimmediate');
}

export const getProjectAnnotations =
  (view: View, annotations: ModuleExports[]) =>
  async (): Promise<NormalizedProjectAnnotations<ReactRenderer>> =>
    composeConfigs<ReactRenderer>([getReactNativeProjectAnnotations(() => view), ...annotations]);

export function start({
  annotations,
  storyEntries,
  options,
}: {
  storyEntries: StoryEntry[];
  annotations: ModuleExports[];
  options?: ReactNativeOptions;
}) {
  const composedAnnotations = composeConfigs<ReactRenderer>(annotations);

  const { index, importMap } = prepareStories({
    storyEntries,
    options,
    storySort: composedAnnotations.parameters?.options?.storySort,
  });

  // const channel = createBrowserChannel({ page: 'preview' });
  const channel = new Channel({});

  managerAddons.setChannel(channel);
  previewAddons.setChannel(channel);

  if (globalThis.FEATURES?.ondeviceBackgrounds) {
    const { registerBackgroundsAddon } = require('./backgrounds/register');
    registerBackgroundsAddon();
  }

  const previewView = {
    prepareForStory: () => {
      return createPreviewRoot();
    },
    prepareForDocs: () => {
      return createPreviewRoot();
    },
    showErrorDisplay: (e: { message?: string; stack?: string }) => {
      console.log(e);
    },
    showDocs: () => {},
    showMain: () => {},
    showNoPreview: () => {},
    showPreparingDocs: () => {},
    showPreparingStory: () => {},
    showStory: () => {},
    showStoryDuringRender: () => {},
  } satisfies PreviewView<ReactRenderer['canvasElement']>;

  const selectionStore = {
    selection: null as unknown as SelectionStore['selection'],
    selectionSpecifier: null,
    setQueryParams: () => {},
    setSelection: (selection: NonNullable<SelectionStore['selection']>) => {
      preview.selectionStore.selection = selection;
    },
  } satisfies SelectionStore;

  let view: View;

  const getProjectAnnotationsInitial = async (): Promise<
    NormalizedProjectAnnotations<ReactRenderer>
  > =>
    composeConfigs<ReactRenderer>([getReactNativeProjectAnnotations(() => view), ...annotations]);

  const preview: PreviewWithSelection<ReactRenderer> = new PreviewWithSelection<ReactRenderer>(
    async (importPath: string) => importMap[importPath],
    getProjectAnnotationsInitial,
    selectionStore,
    previewView
  );

  view = new View(preview, channel, options);

  if (global) {
    const storybookGlobal = global as typeof globalThis & {
      __STORYBOOK_ADDONS_CHANNEL__?: Channel;
      __STORYBOOK_PREVIEW__?: PreviewWithSelection<ReactRenderer>;
    };

    storybookGlobal.__STORYBOOK_ADDONS_CHANNEL__ = channel;
    storybookGlobal.__STORYBOOK_PREVIEW__ = preview;
  }

  view._storyIndex = index;

  preview.getStoryIndexFromServer = async () => view._storyIndex;

  return view;
}

export function updateView(
  viewInstance: View,
  annotations: ModuleExports[],
  normalizedStories: StoryEntry[],
  options?: ReactNativeOptions
) {
  const composedAnnotations = composeConfigs<ReactRenderer>(annotations);

  const storySort = composedAnnotations.parameters?.options?.storySort;

  const { importMap, index } = prepareStories({
    storyEntries: normalizedStories,
    options,
    storySort,
  });

  viewInstance._preview.onStoriesChanged({
    importFn: async (importPath: string) => importMap[importPath],
  });

  viewInstance._preview.onGetProjectAnnotationsChanged({
    getProjectAnnotations: getProjectAnnotations(viewInstance, annotations),
  });

  viewInstance._storyIndex = index;
  viewInstance._preview.onStoryIndexChanged().then(() => {
    viewInstance.createPreparedStoryMapping().then(() => viewInstance._forceRerender());
  });
}
