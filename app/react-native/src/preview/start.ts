import Channel from '@storybook/channels';
import { addons } from '@storybook/addons';
import Events from '@storybook/core-events';
import { Loadable } from '@storybook/core-client';

import { ClientApi } from '@storybook/client-api';
import type { ReactFramework } from '../types-6.0';
import { Preview } from './Preview';
import { executeLoadableForChanges } from './executeLoadable';

type TFramework = ReactFramework;

export function start() {
  const channel = new Channel({ async: true });
  addons.setChannel(channel);

  const clientApi = new ClientApi<TFramework>();
  const preview = new Preview();
  let initialized = false;

  function onStoriesChanged() {
    const storyIndex = clientApi.getStoryIndex();
    preview.onStoriesChanged({ storyIndex });
  }

  return {
    forceReRender: () => channel.emit(Events.FORCE_RE_RENDER),
    clientApi,
    preview,
    // This gets called each time the user calls configure (i.e. once per HMR)
    // The first time, it constructs the preview, subsequently it updates it
    configure(framework: string, loadable: Loadable, m?: NodeModule) {
      clientApi.addParameters({ framework });

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

        return clientApi.facade.projectAnnotations;
      };

      if (!initialized) {
        preview.initialize({
          getStoryIndex: () => clientApi.getStoryIndex(),
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
