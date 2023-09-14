import { toId, storyNameFromExport } from '@storybook/csf';
import { PreviewWithSelection } from '@storybook/preview-web';
import { addons, composeConfigs, userOrAutoTitle } from '@storybook/preview-api';
import { createBrowserChannel } from '@storybook/channels';

import { View } from './View';
import type { ReactNativeFramework } from '../types/types-6.0';
import type { NormalizedStoriesSpecifier } from '@storybook/types';

export function prepareStories({
  stories,
  storyEntries,
}: {
  stories: Array<{
    root: string;
    req: any;
  }>;
  storyEntries: NormalizedStoriesSpecifier[];
}) {
  let index = {
    v: 4,
    entries: {},
  };

  let importMap = {};

  const makeTitle = (fileName: string, userTitle: string) => {
    const title = userOrAutoTitle(fileName, storyEntries, userTitle);
    console.log({ fileName, userTitle, title, storyEntries });
    return title;
  };

  stories.forEach(({ req, root }) => {
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

          const exportValue = fileExports[key];
          if (!exportValue) return;

          //FIXME: autotitle
          const name = storyNameFromExport(key);
          const title = makeTitle(filename, meta.title);
          const id = toId(title, name);

          index.entries[id] = {
            type: 'story',
            id,
            name,
            title,
            importPath: `${root}/${filename.substring(2)}`, // FIXME: use normalize function here
            tags: ['story'],
          };

          importMap[`${root}/${filename.substring(2)}`] = req(filename);
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

export function start({
  stories,
  annotations,
  storyEntries,
}: {
  storyEntries: NormalizedStoriesSpecifier[];
  stories: Array<{
    root: string;
    req: any;
  }>;
  annotations: any[];
}) {
  const { index, importMap } = prepareStories({ stories, storyEntries });

  const channel = createBrowserChannel({ page: 'preview' });
  addons.setChannel(channel);

  const previewView = {
    prepareForStory: () => {
      return <></>;
    },
    prepareForDocs: () => {},
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
  };

  const urlStore = {
    selection: null,
    selectionSpecifier: null,
    setQueryParams: () => {},
    setSelection: (selection) => {
      preview.selectionStore.selection = selection;
    },
  };

  const preview = new PreviewWithSelection<ReactNativeFramework>(urlStore, previewView);

  const view = new View(preview);

  const getProjectAnnotations = async () =>
    composeConfigs<ReactNativeFramework>([
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

  preview.initialize({
    importFn: async (importPath: string) => importMap[importPath],
    getProjectAnnotations,
    getStoryIndex: () => index as any,
  });

  view._storyIndex = index;

  return view;
}
