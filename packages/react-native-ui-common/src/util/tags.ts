import type { API_HashEntry, API_IndexHash } from 'storybook/internal/types';

const BuiltInTag = {
  AUTODOCS: 'autodocs',
  ATTACHED_MDX: 'attached-mdx',
  UNATTACHED_MDX: 'unattached-mdx',
  PLAY_FN: 'play-fn',
  TEST_FN: 'test-fn',
  DEV: 'dev',
  TEST: 'test',
  MANIFEST: 'manifest',
} as const;

const BUILT_IN_TAGS = new Set<string>(Object.values(BuiltInTag));

export type SidebarTagFilter = {
  id: string;
  type: 'tag' | 'built-in';
  title: string;
  count: number;
  filterFn: (entry: SidebarFilterableEntry, excluded?: boolean) => boolean;
};

export type SidebarTagSelection = {
  included: Set<string>;
  excluded: Set<string>;
};

export const createEmptySidebarTagSelection = (): SidebarTagSelection => ({
  included: new Set<string>(),
  excluded: new Set<string>(),
});

export const hasActiveSidebarTagSelection = ({ included, excluded }: SidebarTagSelection) =>
  included.size > 0 || excluded.size > 0;

export const groupSidebarTagFiltersByType = (filters: SidebarTagFilter[]) =>
  filters.filter(Boolean).reduce(
    (acc, filter) => {
      acc[filter.type] ??= [];
      acc[filter.type].push(filter);
      return acc;
    },
    {} as Record<string, SidebarTagFilter[]>
  );

type SidebarFilterableEntry = Extract<API_HashEntry, { type: 'story' | 'docs' }>;

const isLeafEntry = (entry: API_HashEntry): entry is SidebarFilterableEntry =>
  entry.type === 'story' || entry.type === 'docs';

export const createSidebarTagFilters = (storiesHash?: API_IndexHash) => {
  const entries = Object.values(storiesHash ?? {}).filter(isLeafEntry);

  const userTagsCounts = entries.reduce<Record<string, number>>((acc, entry) => {
    entry.tags?.forEach((tag) => {
      if (!BUILT_IN_TAGS.has(tag)) {
        acc[tag] = (acc[tag] || 0) + 1;
      }
    });
    return acc;
  }, {});

  const userFilters = Object.fromEntries(
    Object.entries(userTagsCounts).map(([tag, count]) => {
      const filterFn = (entry: SidebarFilterableEntry, excluded?: boolean) =>
        excluded ? !entry.tags?.includes(tag) : !!entry.tags?.includes(tag);
      return [tag, { id: tag, type: 'tag', title: tag, count, filterFn }];
    })
  );

  const withCount = (
    filterFn: SidebarTagFilter['filterFn']
  ): Pick<SidebarTagFilter, 'count' | 'filterFn'> => ({
    count: entries.filter((entry) => filterFn(entry)).length,
    filterFn,
  });

  const builtInFilters = {
    _docs: {
      id: '_docs',
      type: 'built-in' as const,
      title: 'Documentation',
      ...withCount((entry: SidebarFilterableEntry, excluded?: boolean) =>
        excluded ? entry.type !== 'docs' : entry.type === 'docs'
      ),
    },
    _play: {
      id: '_play',
      type: 'built-in' as const,
      title: 'Play',
      ...withCount((entry: SidebarFilterableEntry, excluded?: boolean) =>
        excluded
          ? entry.type !== 'story' || !entry.tags?.includes(BuiltInTag.PLAY_FN)
          : entry.type === 'story' && !!entry.tags?.includes(BuiltInTag.PLAY_FN)
      ),
    },
    _test: {
      id: '_test',
      type: 'built-in' as const,
      title: 'Testing',
      ...withCount((entry: SidebarFilterableEntry, excluded?: boolean) =>
        excluded
          ? entry.type !== 'story' || entry.subtype !== 'test'
          : entry.type === 'story' && entry.subtype === 'test'
      ),
    },
  };

  return { ...builtInFilters, ...userFilters } satisfies Record<string, SidebarTagFilter>;
};

export const getVisibleSidebarTagFilters = (filtersById: Record<string, SidebarTagFilter>) => {
  const builtInOrder: Record<string, number> = { _docs: 0, _play: 1, _test: 2 };

  return Object.values(filtersById)
    .filter((filter) => filter.type !== 'built-in' || filter.count > 0)
    .sort((left, right) => {
      if (left.type !== right.type) {
        return left.type === 'built-in' ? -1 : 1;
      }

      if (left.type === 'built-in' && right.type === 'built-in') {
        return (builtInOrder[left.id] ?? 99) - (builtInOrder[right.id] ?? 99);
      }

      return left.title.localeCompare(right.title);
    });
};

export const createSidebarTagFilter = (
  filtersById: Record<string, SidebarTagFilter>,
  selection: SidebarTagSelection
) => {
  const included = Object.values(
    groupSidebarTagFiltersByType(
      Array.from(selection.included)
        .map((id) => filtersById[id])
        .filter((value): value is SidebarTagFilter => !!value)
    )
  );
  const excluded = Object.values(
    groupSidebarTagFiltersByType(
      Array.from(selection.excluded)
        .map((id) => filtersById[id])
        .filter((value): value is SidebarTagFilter => !!value)
    )
  );

  return (item: SidebarFilterableEntry) =>
    (!included.length ||
      included.every((group) => group.some(({ filterFn }) => filterFn(item, false)))) &&
    (!excluded.length ||
      excluded.every((group) => group.every(({ filterFn }) => filterFn(item, true))));
};

export const filterStoriesHashByTags = (
  storiesHash: API_IndexHash | undefined,
  selection: SidebarTagSelection
) => {
  if (!storiesHash || !hasActiveSidebarTagSelection(selection)) {
    return storiesHash;
  }

  const filtersById = createSidebarTagFilters(storiesHash);
  const filterFn = createSidebarTagFilter(filtersById, selection);
  const includedIds = new Set<string>();

  Object.values(storiesHash)
    .filter(isLeafEntry)
    .forEach((entry) => {
      if (!filterFn(entry)) {
        return;
      }

      let currentId: string | null | undefined = entry.id;
      while (currentId && !includedIds.has(currentId)) {
        includedIds.add(currentId);
        const currentEntry = storiesHash[currentId];
        currentId = currentEntry && 'parent' in currentEntry ? currentEntry.parent : undefined;
      }
    });

  return Object.keys(storiesHash).reduce<API_IndexHash>((acc, id) => {
    if (!includedIds.has(id)) {
      return acc;
    }

    const entry = storiesHash[id];

    if ('children' in entry && Array.isArray(entry.children)) {
      acc[id] = {
        ...entry,
        children: entry.children.filter((childId) => includedIds.has(childId)),
      };
      return acc;
    }

    acc[id] = entry;
    return acc;
  }, {});
};
