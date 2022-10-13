import Channel from '@storybook/channels';
import { addons } from '@storybook/addons';
import Events from '@storybook/core-events';
import { Loadable } from '@storybook/core-client';

import { PreviewWeb } from '@storybook/preview-web';
import { ClientApi, RenderContext } from '@storybook/client-api';
import type { ReactFramework } from '../types-6.0';
import { Preview as PreviewNative } from './Preview';
import { executeLoadableForChanges } from './executeLoadable';

type TFramework = ReactFramework;

export function start() {
  const channel = new Channel({ async: true });
  addons.setChannel(channel);

  // const storyStore = new StoryStore<TFramework>();
  const clientApi = new ClientApi<TFramework>();
  // const preview = new Preview({ storyStore });
  const preview = new PreviewWeb<TFramework>();

  clientApi.storyStore = preview.storyStore;

  preview.urlStore = {
    selection: { storyId: '', viewMode: 'story' },
    selectionSpecifier: null,
    setQueryParams: () => {},
    setSelection: (selection) => {
      preview.urlStore.selection = selection;
    },
  };

  // @ts-ignore
  preview.view = {
    ...preview.view,
    // @ts-ignore
    prepareForStory: () => {
      return null;
    },
    showNoPreview: () => {},
    showPreparingStory: () => {},
    applyLayout: () => {},
    showErrorDisplay: (e) => {
      console.log(e);
    },
    showStoryDuringRender: () => {
      console.log('showstory');
    },
    showMain: () => {
      console.log('showmain');
    },
  };

  let initialized = false;

  function onStoriesChanged() {
    const storyIndex = clientApi.getStoryIndex();
    preview.onStoriesChanged({ storyIndex });
    previewNative._storyIndex = storyIndex;
  }

  const previewNative = new PreviewNative();

  return {
    previewNative,
    forceReRender: () => channel.emit(Events.FORCE_RE_RENDER),
    clientApi,
    preview,
    // This gets called each time the user calls configure (i.e. once per HMR)
    // The first time, it constructs the preview, subsequently it updates it
    configure(loadable: Loadable /*m?: NodeModule*/) {
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
          renderToDOM: (context: RenderContext) => {
            console.log({ context: context.storyContext });
            previewNative._setStory({ story: context.storyContext });
          },
        };
      };

      const importFn = (path: string) => clientApi.importFn(path);

      if (!initialized) {
        preview.initialize({
          getStoryIndex: () => {
            const index = clientApi.getStoryIndex();
            previewNative._storyIndex = index;
            return index;
          },
          // @ts-ignore
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
