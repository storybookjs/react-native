import './polyfill';
import { Platform } from 'react-native';
import { addons as managerAddons } from 'storybook/manager-api';
import {
  composeConfigs,
  addons as previewAddons,
  PreviewWithSelection,
  View as PreviewView,
  SelectionStore,
} from 'storybook/internal/preview-api';
// NOTE this really should be exported from preview-api, but it's not
import { Channel } from 'storybook/internal/channels';
import type { NormalizedStoriesSpecifier } from 'storybook/internal/types';
import type { ReactRenderer } from '@storybook/react';
import { View } from './View';
import { prepareStories, type ReactNativeOptions } from './prepareStories';
export { prepareStories, type ReactNativeOptions } from './prepareStories';

/**
 * Since we aren't supporting  these web addons yet in react native (or reimplement them) then we should disable them
 * to avoid running code for addons that are not supported.
 */
globalThis.FEATURES = {
  measure: false,
  outline: false,
  interactions: false,
  viewport: false,
  highlight: false,
  backgrounds: false,
};

// Note this is a workaround for setImmediate not being defined
if (Platform.OS === 'web' && typeof globalThis.setImmediate === 'undefined') {
  require('setimmediate');
}

export const getProjectAnnotations = (view: View, annotations: any[]) => async () =>
  composeConfigs<ReactRenderer>([
    {
      renderToCanvas: (context) => {
        view._setStory(context.storyContext);
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
    },
    ...annotations,
  ]);

export function start({
  annotations,
  storyEntries,
  options,
}: {
  storyEntries: (NormalizedStoriesSpecifier & { req: any })[];
  annotations: any[];
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
      return {
        component: () => <></>,
        canvasElement: null,
        mount: () => Promise.resolve({}),
        storyResult: null,
        T: null,
      } as any;
    },
    prepareForDocs: (): any => {},
    showErrorDisplay: (e) => {
      console.log(e);
    },
    showDocs: () => {},
    showMain: () => {},
    showNoPreview: () => {},
    showPreparingDocs: () => {},
    showPreparingStory: () => {},
    showStory: () => {},
    showStoryDuringRender: () => {},
  } satisfies PreviewView<ReactRenderer>;

  const selectionStore = {
    selection: null,
    selectionSpecifier: null,
    setQueryParams: () => {},
    setSelection: (selection) => {
      preview.selectionStore.selection = selection;
    },
  } satisfies SelectionStore;

  const getProjectAnnotationsInitial = async () =>
    composeConfigs<ReactRenderer>([
      {
        renderToCanvas: (context) => {
          view._setStory(context.storyContext);
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
      },
      ...annotations,
    ]);

  const preview = new PreviewWithSelection<ReactRenderer>(
    async (importPath: string) => importMap[importPath],
    getProjectAnnotationsInitial,
    selectionStore,
    previewView as any
  );

  const view = new View(preview, channel);

  if (global) {
    global.__STORYBOOK_ADDONS_CHANNEL__ = channel;
    global.__STORYBOOK_PREVIEW__ = preview;
  }

  view._storyIndex = index;

  preview.getStoryIndexFromServer = async () => view._storyIndex;

  return view;
}

export function updateView(
  viewInstance: View,
  annotations: any[],
  normalizedStories: (NormalizedStoriesSpecifier & { req: any })[],
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
