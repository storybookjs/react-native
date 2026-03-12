import { sortStoriesV7, userOrAutoTitleFromSpecifier } from 'storybook/internal/preview-api';
import { isExportStory, storyNameFromExport, toId } from 'storybook/internal/csf';
import type {
  Addon_StorySortParameterV7,
  NormalizedStoriesSpecifier,
  StoryIndex,
} from 'storybook/internal/types';
import { getStoryEntryTags } from './storyTags';

type StoryModuleExport = Readonly<Record<string, unknown>> & {
  play?: unknown;
  name?: string;
  storyName?: string;
  tags?: unknown;
};

/** Configuration options that are needed at startup, only serialisable values are possible */
export interface ReactNativeOptions {
  /**
   * Note that this is for future and play functions are not yet fully supported on native.
   */
  playFn?: boolean;
}

export function prepareStories({
  storyEntries,
  options,
  storySort,
}: {
  storyEntries: (NormalizedStoriesSpecifier & { req: any })[];
  options?: ReactNativeOptions;
  storySort?: Addon_StorySortParameterV7;
}) {
  let index: StoryIndex = {
    v: 5,
    entries: {},
  };

  let importMap: Record<string, Record<string, unknown>> = {};

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
        const fileExports = req(filename);
        // TODO: should this be here?
        if (!fileExports.default) return;
        const meta = fileExports.default;

        Object.keys(fileExports).forEach((key) => {
          if (key === 'default') return;
          if (!isExportStory(key, fileExports.default)) return;

          const exportValue = fileExports[key];
          if (!exportValue) return;

          const title = makeTitle(filename, specifier, meta.title);

          if (title) {
            const nameFromExport = storyNameFromExport(key);
            const id = toId(title, nameFromExport);

            let name = nameFromExport;

            if (typeof exportValue === 'function') {
              name = exportValue?.storyName || nameFromExport;
            } else {
              name = exportValue?.name || exportValue?.storyName || nameFromExport;
            }

            index.entries[id] = {
              type: 'story',
              id,
              name,
              title,
              importPath: `${root}/${filename.substring(2)}`, // FIXME: use normalize function here
              tags: getStoryEntryTags({
                metaTags: meta.tags,
                storyTags: exportValue?.tags,
                hasPlayFn: !!(exportValue?.play && options?.playFn),
              }),
              subtype: 'story',
            };

            const importedStories = req(filename) as Record<string, unknown>;
            const stories = Object.entries(importedStories).reduce<Record<string, unknown>>(
              (carry, [storyKey, story]) => {
                if (!isExportStory(storyKey, fileExports.default)) return carry;

                const typedStory = story as StoryModuleExport;

                if (typedStory.play && !options?.playFn) {
                  // play functions are not yet fully supported on native.
                  // There is a new option in main.js to turn them on for future use.
                  carry[storyKey] = { ...typedStory, play: undefined };
                } else {
                  carry[storyKey] = typedStory;
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
          error instanceof Error && error.message && error.stack
            ? `${error.message}\n ${error.stack}`
            : String(error);
        console.error(`Unexpected error while loading ${filename}: ${errorString}`);
      }
    });
  });

  const sortableStories = Object.values(index.entries);

  sortStoriesV7(
    sortableStories,
    storySort,
    Object.values(index.entries).map((entry) => entry.importPath)
  );

  const sorted = sortableStories.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as StoryIndex['entries']
  );

  return { index: { v: 5, entries: sorted }, importMap };
}
