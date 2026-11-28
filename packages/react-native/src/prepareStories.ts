import { userOrAutoTitleFromSpecifier } from 'storybook/internal/preview-api';
import { isExportStory, isStory, storyNameFromExport, toId } from 'storybook/internal/csf';
import type {
  Addon_StorySortParameterV7,
  NormalizedStoriesSpecifier,
  StoryIndex,
} from 'storybook/internal/types';
import { sortIndexEntries } from './sortStories';
import { PLAY_FN_TAG, combineStoryTags } from './storyTags';

/** Configuration options that are needed at startup, only serialisable values are possible */
export interface ReactNativeOptions {
  /**
   * Note that this is for future and play functions are not yet fully supported on native.
   */
  playFn?: boolean;
}

/**
 * The tags of a meta or story, followed by `play-fn` when it has a play function, like the tags
 * Storybook reads from a CSF file. CSF factories keep their annotations on `input`.
 */
const getAnnotationTags = (annotations: any): unknown[] => {
  const input = annotations?._tag ? annotations.input : annotations;
  const tags = Array.isArray(input?.tags) ? input.tags : [];

  return typeof input?.play === 'function' ? [...tags, PLAY_FN_TAG] : tags;
};

export function prepareStories({
  storyEntries,
  options,
  storySorts = [],
  projectTags = [],
}: {
  storyEntries: (NormalizedStoriesSpecifier & { req: any })[];
  options?: ReactNativeOptions;
  /** The `storySorts` from main, chained in order. */
  storySorts?: Addon_StorySortParameterV7[];
  /** The `tags` from the project annotations, applied to every story before its meta and story tags. */
  projectTags?: string[];
}) {
  let index: StoryIndex = {
    v: 5,
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
        const fileExports = req(filename);
        // Like Storybook's processCSFFile: a CSF factories file needs no default export, its meta
        // comes from its stories. Read the meta's `input`, as only our definePreview exposes
        // title/includeStories/excludeStories on the meta itself.
        const { default: defaultExport, ...namedExports } = fileExports;
        const factoryStory = Object.values(namedExports).find(isStory);
        const meta = factoryStory ? factoryStory.meta.input : defaultExport;
        if (!meta) return;
        const metaTags = getAnnotationTags(meta);

        Object.keys(fileExports).forEach((key) => {
          if (key === 'default') return;
          if (!isExportStory(key, meta)) return;

          const exportValue = fileExports[key];
          if (!exportValue) return;
          // in a CSF factories file only factory stories are stories
          if (factoryStory && !isStory(exportValue)) return;

          const title = makeTitle(filename, specifier, meta.title);

          if (title) {
            const nameFromExport = storyNameFromExport(key);
            const id = toId(title, nameFromExport);

            // For CSF factories, read the explicit name from input (avoids triggering
            // composeStory which doesn't have the export name). For plain CSF, fall
            // back to .name / .storyName / the export-derived name.
            let name: string;
            if (exportValue?._tag === 'Story') {
              name = exportValue.input?.name ?? nameFromExport;
            } else if (typeof exportValue === 'function') {
              name = exportValue.storyName || nameFromExport;
            } else {
              name = exportValue?.name || exportValue?.storyName || nameFromExport;
            }

            index.entries[id] = {
              type: 'story',
              id,
              name,
              title,
              importPath: `${root}/${filename.substring(2)}`, // FIXME: use normalize function here
              tags: combineStoryTags({
                projectTags,
                metaTags,
                storyTags: getAnnotationTags(exportValue),
              }),
              subtype: 'story',
            };

            const importedStories = req(filename) as Record<string, Readonly<Record<string, any>>>;
            const stories = Object.entries(importedStories).reduce<
              Record<string, Readonly<Record<string, any>>>
            >((carry, [storyKey, story]) => {
              if (!isExportStory(storyKey, meta)) return carry;

              // Factory stories are left as they are: Storybook reads their play function from
              // `input`, and spreading them would read their getters, composing them eagerly.
              if (typeof story.play === 'function' && !options?.playFn && !isStory(story)) {
                // play functions are not yet fully supported on native.
                // There is a new option in main.js to turn them on for future use.
                carry[storyKey] = { ...story, play: undefined };
              } else {
                carry[storyKey] = story;
              }
              return carry;
            }, {});

            importMap[`${root}/${filename.substring(2)}`] = stories;
          } else {
            console.log(`Unexpected error while loading ${filename}: could not find title`);
          }
        });
      } catch (error) {
        const typedError = error as Error;
        const errorString =
          typedError.message && typedError.stack
            ? `${typedError.message}\n ${typedError.stack}`
            : typedError.toString();
        console.error(`Unexpected error while loading ${filename}: ${errorString}`);
      }
    });
  });

  const sorted = sortIndexEntries(index.entries, storySorts);

  return { index: { v: 5, entries: sorted }, importMap };
}
