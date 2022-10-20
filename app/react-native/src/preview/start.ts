import Channel from '@storybook/channels';
import { addons } from '@storybook/addons';
import Events from '@storybook/core-events';
import { Loadable } from '@storybook/core-client';
import { PreviewWeb } from '@storybook/preview-web';
import { ClientApi, RenderContext } from '@storybook/client-api';
import type { ReactNativeFramework } from '../types/types-6.0';
import { View } from './View';
import { executeLoadableForChanges } from './executeLoadable';

export function start() {
  const channel = new Channel({ async: true });
  addons.setChannel(channel);

  const clientApi = new ClientApi<ReactNativeFramework>();

  const preview = new PreviewWeb<ReactNativeFramework>();

  clientApi.storyStore = preview.storyStore;

  preview.urlStore = {
    selection: { storyId: '', viewMode: 'story' },
    selectionSpecifier: null,
    setQueryParams: () => {},
    setSelection: (selection) => {
      preview.urlStore.selection = selection;
    },
  };

  preview.view = {
    ...preview.view,
    prepareForStory: () => null,
    showNoPreview: () => {},
    showPreparingStory: () => {},
    applyLayout: () => {},
    showErrorDisplay: (e) => {
      console.log(e);
    },
    showStoryDuringRender: () => {},
    showMain: () => {},
    // these are just to make typescript happy
    showDocs: preview.view?.showDocs,
    storyRoot: preview.view?.storyRoot,
    prepareForDocs: preview.view?.prepareForDocs,
    docsRoot: preview.view?.docsRoot,
    checkIfLayoutExists: preview.view?.checkIfLayoutExists,
    showMode: preview.view?.showMode,
    showPreparingDocs: preview.view?.showPreparingDocs,
    showStory: preview.view?.showStory,
  };

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
    // The first time, it constructs the preview, subsequently it updates it
    configure(loadable: Loadable) {
      clientApi.addParameters({ framework: 'react-native' });

      // We need to run the `executeLoadableForChanges` function *inside* the `getProjectAnnotations
      // function in case it throws. So we also need to process its output there also
      const getProjectAnnotations = () => {
        const { added, removed } = executeLoadableForChanges(loadable /*,m*/);

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
