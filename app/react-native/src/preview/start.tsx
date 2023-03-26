import { addons } from '@storybook/addons';
import Channel from '@storybook/channels';
import { ClientApi, RenderContext, setGlobalRender } from '@storybook/client-api';
import { Loadable } from '@storybook/core-client';
import Events from '@storybook/core-events';
import type { ArgsStoryFn, ViewMode } from '@storybook/csf';
import { PreviewWeb } from '@storybook/preview-web';
import React from 'react';
import type { ReactNativeFramework } from '../types/types-6.0';
import { executeLoadableForChanges } from './executeLoadable';
import { View } from './View';

export const render: ArgsStoryFn<ReactNativeFramework> = (args, context) => {
  const { id, component: Component } = context;

  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  return <Component {...args} />;
};

export function start() {
  // TODO: can we get settings from main.js and set the channel here?
  const channel = new Channel({ async: true });

  addons.setChannel(channel);

  const clientApi = new ClientApi<ReactNativeFramework>();

  const previewView = {
    prepareForStory: () => null,
    showNoPreview: () => {},
    showPreparingStory: () => {},
    applyLayout: () => {},
    showErrorDisplay: (e) => {
      console.log(e);
    },
    showStoryDuringRender: () => {},
    showMain: () => {},
    checkIfLayoutExists: () => {},
    showStory: () => {},
    docsRoot: null,
    prepareForDocs: () => null,
    showDocs: () => {},
    preparingTimeout: setTimeout(() => {}, 0),
    showMode: () => {},
    showPreparingDocs: () => {},
    storyRoot: null,
    testing: false,
  };

  const urlStore = {
    selection: { storyId: '', viewMode: 'story' as ViewMode },
    selectionSpecifier: null,
    setQueryParams: () => {},
    setSelection: (selection) => {
      preview.urlStore.selection = selection;
    },
  };

  const preview = new PreviewWeb<ReactNativeFramework>(urlStore, previewView);

  clientApi.storyStore = preview.storyStore;

  setGlobalRender(render);

  let initialized = false;

  function onStoriesChanged() {
    const storyIndex = clientApi.getStoryIndex();

    preview.onStoriesChanged({ storyIndex });

    view._storyIndex = storyIndex;
  }

  const view = new View(preview);

  return {
    view,
    forceReRender: () => channel.emit(Events.FORCE_RE_RENDER),
    clientApi,
    preview,
    // This gets called each time the user calls configure (i.e. once per HMR)
    // The first time, it constructs thecurrentSelection preview, subsequently it updates it
    configure(loadable: Loadable, m: NodeModule) {
      clientApi.addParameters({ framework: 'react-native' });

      // We need to run the `executeLoadableForChanges` function *inside* the `getProjectAnnotations
      // function in case it throws. So we also need to process its output there also
      const getProjectAnnotations = () => {
        const { added, removed } = executeLoadableForChanges(loadable, m);

        Array.from(added.entries()).forEach(([fileName, fileExports]) =>
          clientApi.facade.addStoriesFromExports(fileName, fileExports)
        );

        Array.from(removed.entries()).forEach(([fileName]) =>
          clientApi.facade.clearFilenameExports(fileName)
        );

        return {
          ...clientApi.facade.projectAnnotations,
          renderToDOM: (context: RenderContext<ReactNativeFramework>) => {
            view._setStory(context.storyContext);
          },
        };
      };

      const importFn = (path: string) => clientApi.importFn(path);

      if (!initialized) {
        preview.initialize({
          getStoryIndex: () => {
            const index = clientApi.getStoryIndex();

            view._storyIndex = index;

            return index;
          },
          importFn,
          getProjectAnnotations,
        });

        initialized = true;
      } else {
        // TODO -- why don't we care about the new annotations?
        getProjectAnnotations();

        onStoriesChanged();
      }
    },
  };
}
