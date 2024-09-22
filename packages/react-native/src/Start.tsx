import { Platform } from 'react-native';

// @ts-ignore
if (Platform.OS !== 'web') {
  // We polyfill URLSearchParams for React Native since URLSearchParams.get is not implemented yet is used in storybook
  // with expo this would never run because its already polyfilled
  try {
    let params = new URLSearchParams({ test: '1' });

    // the base react native url implementation throws an error when trying to access this function
    params.get('test');
  } catch {
    const { setupURLPolyfill } = require('react-native-url-polyfill');

    setupURLPolyfill();
  }
}

import { addons as managerAddons } from '@storybook/core/manager-api';
import {
  composeConfigs,
  addons as previewAddons,
  PreviewWithSelection,
  userOrAutoTitleFromSpecifier,
} from '@storybook/core/preview-api';
import { isExportStory, storyNameFromExport, toId } from '@storybook/csf';
// NOTE this really should be exported from preview-api, but it's not
import { createBrowserChannel } from '@storybook/core/channels';
import type { NormalizedStoriesSpecifier, StoryIndex } from '@storybook/core/types';
import type { ReactRenderer } from '@storybook/react';
import { View } from './View';

/** Configuration options that are needed at startup, only serialisable values are possible */
export interface ReactNativeOptions {
  /**
   * Note that this is for future and play functions are not yet fully supported on native.
   */
  playFn?: boolean;
}

// Note this is a workaround for setImmediate not being defined
if (Platform.OS === 'web' && typeof globalThis.setImmediate === 'undefined') {
  require('setimmediate');
}

export function prepareStories({
  storyEntries,
  options,
}: {
  storyEntries: Array<NormalizedStoriesSpecifier & { req: any }>;
  options?: ReactNativeOptions;
}) {
  let index: StoryIndex = {
    v: 4,
    entries: {},
  };

  let importMap: Record<string, any> = {};

  const makeTitle = (
    fileName: string,
    specifier: NormalizedStoriesSpecifier,
    userTitle: string
  ) => {
    const title = userOrAutoTitleFromSpecifier(fileName, specifier, userTitle);

    if (title) {
      return title.replace('./', '');
    } else {
      console.log({
        fileName,
        userTitle,
        storyEntries: storyEntries.map((entry) => {
          return { ...entry, importPathMatcher: entry.importPathMatcher.source };
        }),
        title: title ?? '',
      });

      throw new Error('Could not generate title');
    }
  };

  storyEntries.forEach((specifier) => {
    const { req, directory: root } = specifier;
    req.keys().forEach((filename: string) => {
      try {
        // console.log('req', req.resolve(filename));
        // console.log('filename', filename);
        const fileExports = req(filename);
        // TODO: should this be here?
        if (!fileExports.default) return;
        const meta = fileExports.default;
        Object.keys(fileExports).forEach((key) => {
          if (key === 'default') return;
          if (!isExportStory(key, fileExports.default)) return;

          const exportValue = fileExports[key];
          if (!exportValue) return;

          //FIXME: autotitle
          const name = storyNameFromExport(key);
          const title = makeTitle(filename, specifier, meta.title);

          if (title) {
            const id = toId(title, name);

            index.entries[id] = {
              type: 'story',
              id,
              name,
              title,
              importPath: `${root}/${filename.substring(2)}`, // FIXME: use normalize function here
              tags: ['story'],
            };

            const importedStories = req(filename);
            const stories = Object.entries(importedStories).reduce(
              (carry, [storyKey, story]: [string, Readonly<Record<string, unknown>>]) => {
                if (!isExportStory(storyKey, fileExports.default)) return carry;
                if (story.play && !options?.playFn) {
                  // play functions are not yet fully supported on native.
                  // There is a new option in main.js to turn them on for future use.
                  carry[storyKey] = { ...story, play: undefined };
                } else {
                  carry[storyKey] = story;
                }
                return carry;
              },
              {}
            );

            importMap[`${root}/${filename.substring(2)}`] = stories;
          } else {
            console.log(`Unexpected error while loading ${filename}: could not find title`);
          }
        });
      } catch (error) {
        const errorString =
          error.message && error.stack ? `${error.message}\n ${error.stack}` : error.toString();
        console.error(`Unexpected error while loading ${filename}: ${errorString}`);
      }
    });
  });

  return { index, importMap };
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
  storyEntries: Array<NormalizedStoriesSpecifier & { req: any }>;
  annotations: any[];
  options?: ReactNativeOptions;
}) {
  const { index, importMap } = prepareStories({ storyEntries, options });

  const channel = createBrowserChannel({ page: 'preview' });

  managerAddons.setChannel(channel);
  previewAddons.setChannel(channel);

  const previewView = {
    prepareForStory: () => {
      return <></>;
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
    // TODO what happened to this type?
  } as any;

  const selectionStore = {
    selection: null,
    selectionSpecifier: null,
    setQueryParams: () => {},
    setSelection: (selection) => {
      preview.selectionStore.selection = selection;
    },
  };

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

  // const preview = new PreviewWithSelection<ReactRenderer>(urlStore, previewView);
  const preview = new PreviewWithSelection<ReactRenderer>(
    async (importPath: string) => importMap[importPath],
    getProjectAnnotationsInitial,
    selectionStore,
    previewView
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
  normalizedStories: Array<NormalizedStoriesSpecifier & { req: any }>,
  options?: ReactNativeOptions
) {
  const { importMap, index } = prepareStories({ storyEntries: normalizedStories, options });

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
