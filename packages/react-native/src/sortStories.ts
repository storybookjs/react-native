import { sortStoriesV7 } from 'storybook/internal/preview-api';
import type { Addon_StorySortParameterV7, StoryIndex } from 'storybook/internal/types';

/**
 * Sorts index entries like Storybook 11 chains `storySorts`: each sorter only orders the entries
 * that the sorters before it consider equal. Storybook doesn't export its chained comparator, so
 * this applies the sorters as stable sorts from last to first, which gives the same order.
 */
export function sortIndexEntries(
  entries: StoryIndex['entries'],
  storySorts: Addon_StorySortParameterV7[]
): StoryIndex['entries'] {
  const sortableStories = Object.values(entries);
  const fileNameOrder = sortableStories.map((entry) => entry.importPath);

  if (storySorts.length === 0) {
    sortStoriesV7(
      sortableStories,
      undefined as unknown as Addon_StorySortParameterV7,
      fileNameOrder
    );
  }

  for (const storySort of [...storySorts].reverse()) {
    sortStoriesV7(sortableStories, storySort, fileNameOrder);
  }

  return sortableStories.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as StoryIndex['entries']
  );
}
