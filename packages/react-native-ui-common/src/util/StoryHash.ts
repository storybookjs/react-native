import { sanitize } from 'storybook/internal/csf';
import type { API, State } from 'storybook/manager-api';
import type {
  API_ComponentEntry,
  API_DocsEntry,
  API_GroupEntry,
  API_HashEntry,
  API_IndexHash,
  API_PreparedStoryIndex,
  API_Provider,
  API_RootEntry,
  API_StoryEntry,
  DocsOptions,
  IndexEntry,
  StatusesByStoryIdAndTypeId,
  StoryIndexV2,
  StoryIndexV3,
  Tag,
} from 'storybook/internal/types';
import { dedent } from 'ts-dedent';
import { logger } from 'storybook/internal/client-logger';
import { countBy, isEqual, mergeWith } from 'es-toolkit';

type ToStoriesHashOptions = {
  provider: API_Provider<API>;
  docsOptions: DocsOptions;
  filters: State['filters'];
  allStatuses: StatusesByStoryIdAndTypeId;
};
export const intersect = <T>(a: T[], b: T[]): T[] => {
  // no point in intersecting if one of the input is ill-defined
  if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
    return [];
  }

  return a.reduce((acc: T[], aValue) => {
    if (b.includes(aValue)) {
      acc.push(aValue);
    }

    return acc;
  }, []);
};

export const merge = <TObj = any>(a: TObj, ...b: Partial<TObj>[]): TObj => {
  // start with empty object
  let target = {};

  // merge object a unto target
  target = mergeWith(
    {},
    a as Record<PropertyKey, any>,
    (objValue: TObj, srcValue: Partial<TObj>) => {
      if (Array.isArray(srcValue) && Array.isArray(objValue)) {
        srcValue.forEach((s) => {
          const existing = objValue.find((o) => o === s || isEqual(o, s));
          if (!existing) {
            objValue.push(s);
          }
        });

        return objValue;
      }
      if (Array.isArray(objValue)) {
        logger.log(['the types mismatch, picking', objValue]);
        return objValue;
      }
    }
  );

  for (const obj of b) {
    // merge object b unto target
    target = mergeWith(target, obj, (objValue: TObj, srcValue: Partial<TObj>) => {
      if (Array.isArray(srcValue) && Array.isArray(objValue)) {
        srcValue.forEach((s) => {
          const existing = objValue.find((o) => o === s || isEqual(o, s));
          if (!existing) {
            objValue.push(s);
          }
        });

        return objValue;
      }
      if (Array.isArray(objValue)) {
        logger.log(['the types mismatch, picking', objValue]);
        return objValue;
      }
    });
  }

  return target as TObj;
};

export const noArrayMerge = <TObj = any>(a: TObj, ...b: Partial<TObj>[]): TObj => {
  // start with empty object
  let target = {};

  // merge object a unto target
  target = mergeWith(
    {},
    a as Record<PropertyKey, any>,
    (objValue: TObj, srcValue: Partial<TObj>) => {
      // Treat arrays as scalars:
      if (Array.isArray(srcValue)) {
        return srcValue;
      }
    }
  );

  for (const obj of b) {
    // merge object b unto target
    target = mergeWith(target, obj, (objValue: TObj, srcValue: Partial<TObj>) => {
      // Treat arrays as scalars:
      if (Array.isArray(srcValue)) {
        return srcValue;
      }
    });
  }

  return target as TObj;
};

const TITLE_PATH_SEPARATOR = /\s*\/\s*/;

export const transformStoryIndexToStoriesHash = (
  input: API_PreparedStoryIndex | StoryIndexV2 | StoryIndexV3,
  { provider, docsOptions, filters, allStatuses }: ToStoriesHashOptions
): API_IndexHash | any => {
  if (!input.v) {
    throw new Error('Composition: Missing stories.json version');
  }

  let index = input;
  index = index.v === 2 ? transformStoryIndexV2toV3(index as any) : index;
  index = index.v === 3 ? transformStoryIndexV3toV4(index as any) : index;
  index = index.v === 4 ? transformStoryIndexV4toV5(index as any) : index;
  index = index as API_PreparedStoryIndex;

  const entryValues = Object.values(index.entries).filter((entry: any) => {
    let result = true;

    // All stories with a failing status should always show up, regardless of the applied filters
    const storyStatuses = allStatuses[entry.id] ?? {};
    if (Object.values(storyStatuses).some(({ value }) => value === 'status-value:error')) {
      return result;
    }

    Object.values(filters).forEach((filter) => {
      if (result === false) {
        return;
      }
      result = filter({ ...entry, statuses: storyStatuses });
    });

    return result;
  });

  const { sidebar = {} } = provider.getConfig();
  const { showRoots, collapsedRoots = [], renderLabel }: any = sidebar;

  const setShowRoots = typeof showRoots !== 'undefined';

  const storiesHashOutOfOrder = entryValues.reduce((acc: any, item: any) => {
    if (docsOptions.docsMode && item.type !== 'docs') {
      return acc;
    }

    // First, split the title into a set of names, separated by '/' and trimmed.
    const { title } = item;
    const groups = title.trim().split(TITLE_PATH_SEPARATOR);
    const root = (!setShowRoots || showRoots) && groups.length > 1 ? [groups.shift()] : [];
    const names = [...root, ...groups];

    // Now create a "path" or sub id for each name
    const paths = names.reduce((list, name, idx) => {
      const parent = idx > 0 && list[idx - 1];
      const id = sanitize(parent ? `${parent}-${name}` : name!);

      if (name.trim() === '') {
        throw new Error(dedent`Invalid title ${title} ending in slash.`);
      }

      if (parent === id) {
        throw new Error(
          dedent`
          Invalid part '${name}', leading to id === parentId ('${id}'), inside title '${title}'

          Did you create a path that uses the separator char accidentally, such as 'Vue <docs/>' where '/' is a separator char? See https://github.com/storybookjs/storybook/issues/6128
          `
        );
      }
      list.push(id);
      return list;
    }, [] as string[]);

    // Now, let's add an entry to the hash for each path/name pair
    paths.forEach((id: any, idx: any) => {
      // The child is the next path, OR the story/docs entry itself
      const childId = paths[idx + 1] || item.id;

      if (root.length && idx === 0) {
        acc[id] = merge<API_RootEntry>((acc[id] || {}) as API_RootEntry, {
          type: 'root',
          id,
          name: names[idx],
          tags: [],
          depth: idx,
          renderLabel,
          startCollapsed: collapsedRoots.includes(id),
          // Note that this will later get appended to the previous list of children (see below)
          children: [childId],
        });
        // Usually the last path/name pair will be displayed as a component,
        // *unless* there are other stories that are more deeply nested under it
        //
        // For example, if we had stories for both
        //   - Atoms / Button
        //   - Atoms / Button / LabelledButton
        //
        // In this example the entry for 'atoms-button' would *not* be a component.
      } else if ((!acc[id] || acc[id].type === 'component') && idx === paths.length - 1) {
        acc[id] = merge<API_ComponentEntry>((acc[id] || {}) as API_ComponentEntry, {
          type: 'component',
          id,
          name: names[idx],
          tags: [],
          parent: paths[idx - 1],
          depth: idx,
          renderLabel,
          ...(childId && {
            children: [childId],
          }),
        });
      } else {
        acc[id] = merge<API_GroupEntry>((acc[id] || {}) as API_GroupEntry, {
          type: 'group',
          id,
          name: names[idx],
          tags: [],
          parent: paths[idx - 1],
          depth: idx,
          renderLabel,
          ...(childId && {
            children: [childId],
          }),
        });
      }
    });

    // Finally add an entry for the docs/story itself
    acc[item.id] = {
      type: 'story',
      tags: [],
      ...item,
      depth: paths.length,
      parent: paths[paths.length - 1],
      renderLabel,
      prepared: !!item.parameters,
    } as API_DocsEntry | API_StoryEntry;

    return acc;
  }, {} as API_IndexHash);

  // This function adds a "root" or "orphan" and all of its descendents to the hash.
  function addItem(acc: API_IndexHash | any, item: API_HashEntry | any) {
    // If we were already inserted as part of a group, that's great.
    if (acc[item.id]) {
      return acc;
    }

    acc[item.id] = item;
    // Ensure we add the children depth-first *before* inserting any other entries,
    // and compute tags from the children put in the accumulator afterwards, once
    // they're all known and we can compute a sound intersection.
    if (item.type === 'root' || item.type === 'group' || item.type === 'component') {
      item.children.forEach((childId: any) => addItem(acc, storiesHashOutOfOrder[childId]));

      item.tags = item.children.reduce((currentTags: Tag[] | null, childId: any): Tag[] => {
        const child = acc[childId];

        // On the first child, we have nothing to intersect against so we use it as a source of data.
        return currentTags === null ? child.tags : intersect(currentTags, child.tags);
      }, null);
    }
    return acc;
  }

  // We'll do two passes over the data, adding all the orphans, then all the roots
  const orphanHash = Object.values(storiesHashOutOfOrder)
    .filter((i: any) => i.type !== 'root' && !i.parent)
    .reduce(addItem, {});

  return Object.values(storiesHashOutOfOrder)
    .filter((i: any) => i.type === 'root')
    .reduce(addItem, orphanHash);
};

export const transformStoryIndexV2toV3 = (index: StoryIndexV2): StoryIndexV3 => {
  return {
    v: 3,
    stories: Object.values(index.stories).reduce(
      (acc, entry) => {
        acc[entry.id] = {
          ...entry,
          title: entry.kind,
          name: entry.name || entry.story,
          importPath: entry.parameters.fileName || '',
        };

        return acc;
      },
      {} as StoryIndexV3['stories']
    ),
  };
};

export const transformStoryIndexV3toV4 = (index: StoryIndexV3): API_PreparedStoryIndex => {
  const countByTitle = countBy(Object.values(index.stories), (item) => item.title);
  return {
    v: 4,
    entries: Object.values(index.stories).reduce(
      (acc, entry: any) => {
        let type: IndexEntry['type'] = 'story';
        if (
          entry.parameters?.docsOnly ||
          (entry.name === 'Page' && countByTitle[entry.title] === 1)
        ) {
          type = 'docs';
        }
        acc[entry.id] = {
          type,
          ...(type === 'docs' && { tags: ['stories-mdx'], storiesImports: [] }),
          ...entry,
        };

        // @ts-expect-error (we're removing something that should not be there)
        delete acc[entry.id].story;
        // @ts-expect-error (we're removing something that should not be there)
        delete acc[entry.id].kind;

        return acc;
      },
      {} as API_PreparedStoryIndex['entries']
    ),
  };
};

export const transformStoryIndexV4toV5 = (
  index: API_PreparedStoryIndex
): API_PreparedStoryIndex => {
  return {
    v: 5,
    entries: Object.values(index.entries).reduce(
      (acc, entry) => {
        acc[entry.id] = {
          ...entry,
          tags: entry.tags ? ['dev', 'test', ...entry.tags] : ['dev'],
        };

        return acc;
      },
      {} as API_PreparedStoryIndex['entries']
    ),
  };
};
