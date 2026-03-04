import { normalizeStories, loadMainConfig } from 'storybook/internal/common';
import { readFileSync } from 'node:fs';
import { sync as globSync } from 'glob';
import path from 'path';
import { CsfFile, getStorySortParameter, loadCsf } from 'storybook/internal/csf-tools';
import { toId } from 'storybook/internal/csf';
import {
  type StoryIndex,
  type IndexedCSFFile,
  type NormalizedStoriesSpecifier,
} from 'storybook/internal/types';
import { sortStoriesV7, userOrAutoTitleFromSpecifier } from 'storybook/internal/preview-api';
import { getFilePathWithExtension } from '../../scripts/common';

const cwd = process.cwd();

const makeTitle = (fileName: string, specifier: NormalizedStoriesSpecifier, userTitle: string) => {
  const title = userOrAutoTitleFromSpecifier(fileName, specifier, userTitle);

  if (title) {
    return title.replace('./', '');
  } else if (userTitle) {
    return userTitle.replace('./', '');
  } else {
    console.error('Could not generate title!!');
    process.exit(1);
  }
};

function ensureRelativePathHasDot(relativePath: string) {
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

export async function buildIndex({ configPath }: { configPath: string }): Promise<StoryIndex> {
  const main = await loadMainConfig({ configDir: configPath, cwd });
  if (!main.stories || !Array.isArray(main.stories)) {
    throw new Error('No stories found');
  }

  const storiesSpecifiers = normalizeStories(main.stories, {
    configDir: configPath,
    workingDir: cwd,
  });

  const specifierStoryPaths = storiesSpecifiers.map((specifier) => {
    return globSync(specifier.files, {
      cwd: path.resolve(process.cwd(), specifier.directory),
      absolute: true,
      // default to always ignore (exclude) anything in node_modules
      ignore: ['**/node_modules'],
    }).map((storyPath: string) => {
      const normalizePathForWindows = (str: string) =>
        path.sep === '\\' ? str.replace(/\\/g, '/') : str;

      return normalizePathForWindows(storyPath);
    });
  });

  const csfStories = specifierStoryPaths.reduce(
    (acc, specifierStoryPathList, specifierIndex) => {
      const paths = specifierStoryPathList.map((storyPath) => {
        const code = readFileSync(storyPath, { encoding: 'utf-8' }).toString();

        const relativePath = ensureRelativePathHasDot(path.posix.relative(cwd, storyPath));

        return {
          result: loadCsf(code, {
            fileName: storyPath,
            makeTitle: (userTitle) =>
              makeTitle(relativePath, storiesSpecifiers[specifierIndex], userTitle),
          }).parse(),
          specifier: storiesSpecifiers[specifierIndex],
          fileName: relativePath,
        };
      });

      return [...acc, ...paths];
    },
    new Array<{
      result: CsfFile & IndexedCSFFile;
      specifier: NormalizedStoriesSpecifier;
      fileName: string;
    }>()
  );

  const index: StoryIndex = {
    v: 5,
    entries: {},
  };

  for (const { result, specifier, fileName } of csfStories) {
    const { meta, stories } = result;

    if (stories && stories.length > 0) {
      for (const story of stories) {
        const id = story.id ?? toId(meta.title, story.name);

        if (!id) {
          throw new Error(`Failed to generate id for story ${story.name} in file ${fileName}`);
        }

        index.entries[id] = {
          type: 'story',
          subtype: 'story',
          id,
          name: story.name,
          title: meta.title,
          importPath: `${specifier.directory}/${path.posix.relative(specifier.directory, fileName)}`,
          tags: ['story'],
        };
      }
    } else {
      console.log(`No stories found for ${fileName}`);
    }
  }

  try {
    const previewPath = getFilePathWithExtension({ configPath }, 'preview');
    const previewSourceCode = readFileSync(previewPath, { encoding: 'utf-8' }).toString();
    const storySort = getStorySortParameter(previewSourceCode);
    const sortableStories = Object.values(index.entries);

    sortStoriesV7(
      sortableStories,
      storySort,
      sortableStories.map((entry) => entry.importPath)
    );

    const sorted = sortableStories.reduce(
      (acc, item) => {
        acc[item.id] = item;
        return acc;
      },
      {} as StoryIndex['entries']
    );

    return { v: 5, entries: sorted };
  } catch {
    console.warn('Failed to sort stories, using unordered index');
    return index;
  }
}
