import { Channel } from '@storybook/channels';
import Events from '@storybook/core-events';
import type { ArgsStoryFn } from '@storybook/csf';
import { global } from '@storybook/global';
import { addons } from '@storybook/manager-api';
import { ClientApi, setGlobalRender } from '@storybook/preview-api';
import { PreviewWithSelection } from '@storybook/preview-web';
import { RenderContext } from '@storybook/types';
import type { ReactNativeFramework } from '../types/types-6.0';
import { View } from './View';
import { executeLoadableForChanges } from './executeLoadable';

global.FEATURES = {
  storyStoreV7: false,
};

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

  channel.emit(Events.CHANNEL_CREATED);

  const clientApi = global?.__STORYBOOK_CLIENT_API__ || new ClientApi<ReactNativeFramework>();

  const previewView = {
    prepareForStory: () => {
      return <></>;
    },
    prepareForDocs: () => {},
    showErrorDisplay: () => {},
    showDocs: () => {},
    showMain: () => {},
    showNoPreview: () => {},
    showPreparingDocs: () => {},
    showPreparingStory: () => {},
    showStory: () => {},
    showStoryDuringRender: () => {},
  };

  const urlStore = {
    selection: null,
    selectionSpecifier: null,
    setQueryParams: () => {},
    setSelection: (selection) => {
      console.log('setSelection');
      preview.selectionStore.selection = selection;
    },
  };

  const preview =
    global?.__STORYBOOK_PREVIEW__ ||
    new PreviewWithSelection<ReactNativeFramework>(urlStore, previewView);

  clientApi.storyStore = preview.storyStore;

  if (global) {
    global.__STORYBOOK_CLIENT_API__ = clientApi;
    global.__STORYBOOK_ADDONS_CHANNEL__ = channel;
    global.__STORYBOOK_PREVIEW__ = preview;
    global.__STORYBOOK_STORY_STORE__ = preview.storyStore;
  }

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
    configure(loadable: any, m: { hot?: { accept?: () => void } }) {
      clientApi.addParameters({ renderer: 'react-native' });

      // We need to run the `executeLoadableForChanges` function *inside* the `getProjectAnnotations
      // function in case it throws. So we also need to process its output there also
      const getProjectAnnotations = () => {
        const { added, removed } = executeLoadableForChanges(loadable, m);

        clientApi._loadAddedExports();

        Array.from(added.entries()).forEach(([fileName, fileExports]) =>
          clientApi.facade.addStoriesFromExports(fileName, fileExports)
        );

        Array.from(removed.entries()).forEach(([fileName]) =>
          clientApi.facade.clearFilenameExports(fileName)
        );

        return {
          ...clientApi.facade.projectAnnotations,
          renderToCanvas: (context: RenderContext<ReactNativeFramework>) => {
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
