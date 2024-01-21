import { toId, storyNameFromExport } from '@storybook/csf';
import { addons as previewAddons, composeConfigs, userOrAutoTitle } from '@storybook/preview-api';
import { addons as managerAddons } from '@storybook/manager-api';
// NOTE this really should be exported from preview-api, but it's not
import { PreviewWithSelection } from '@storybook/preview-api';
import { createBrowserChannel } from '@storybook/channels';
import { View } from './View';
import type { ReactRenderer } from '@storybook/react';
import type { NormalizedStoriesSpecifier } from '@storybook/types';

export function prepareStories({
  storyEntries,
}: {
  storyEntries: Array<NormalizedStoriesSpecifier & { req: any }>;
}) {
  let index = {
    v: 4,
    entries: {},
  };

  let importMap = {};

  const makeTitle = (fileName: string, userTitle: string) => {
    const title = userOrAutoTitle(fileName, storyEntries, userTitle);

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

  storyEntries.forEach(({ req, directory: root }) => {
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

            importMap[`${root}/${filename.substring(2)}`] = req(filename);
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

export function start({
  annotations,
  storyEntries,
}: {
  storyEntries: Array<NormalizedStoriesSpecifier & { req: any }>;
  annotations: any[];
}) {
  const { index, importMap } = prepareStories({ storyEntries });

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
  };

  const selectionStore = {
    selection: null,
    selectionSpecifier: null,
    setQueryParams: () => {},
    setSelection: (selection) => {
      preview.selectionStore.selection = selection;
    },
  };

  const getProjectAnnotations = async () =>
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
    getProjectAnnotations,
    selectionStore,
    previewView
  );

  const view = new View(preview, channel);

  if (global) {
    global.__STORYBOOK_ADDONS_CHANNEL__ = channel;
    global.__STORYBOOK_PREVIEW__ = preview;
  }

  preview.getStoryIndexFromServer = async () => index;
  // preview.initializeWithStoryIndex(index).catch((e) => {
  //   console.log('error initializing preview', e);
  // });

  view._storyIndex = index;

  return view;
}
