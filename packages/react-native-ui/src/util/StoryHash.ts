import { sanitize } from '@storybook/csf';
import { type API, type State } from '@storybook/core/manager-api';
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
  StoryIndexV2,
  StoryIndexV3,
} from '@storybook/core/types';
import countBy from 'lodash/countBy.js';
import { dedent } from 'ts-dedent';
type ToStoriesHashOptions = {
  provider: API_Provider<API>;
  docsOptions: DocsOptions;
  filters: State['filters'];
  status: State['status'];
};

import isEqual from 'lodash/isEqual.js';
import mergeWith from 'lodash/mergeWith.js';

import { logger } from '@storybook/core/client-logger';

const merge = <TObj = any>(a: TObj, b: Partial<TObj>) =>
  mergeWith({}, a, b, (objValue: TObj, srcValue: Partial<TObj>) => {
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
    return undefined;
  });

const TITLE_PATH_SEPARATOR = /\s*\/\s*/;

export const transformStoryIndexToStoriesHash = (
  input: API_PreparedStoryIndex | StoryIndexV2 | StoryIndexV3,
  { provider, docsOptions, filters, status }: ToStoriesHashOptions
): API_IndexHash | any => {
  if (!input.v) {
    throw new Error('Composition: Missing stories.json version');
  }

  let index = input;
  index = index.v === 2 ? transformStoryIndexV2toV3(index as any) : index;
  index = index.v === 3 ? transformStoryIndexV3toV4(index as any) : index;
  index = index as API_PreparedStoryIndex;

  const entryValues = Object.values(index.entries).filter((entry: any) => {
    let result = true;

    Object.values(filters).forEach((filter: any) => {
      if (result === false) {
        return;
      }
      result = filter({ ...entry, status: status[entry.id] });
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
    // Ensure we add the children depth-first *before* inserting any other entries
    if (item.type === 'root' || item.type === 'group' || item.type === 'component') {
      item.children.forEach((childId: any) => addItem(acc, storiesHashOutOfOrder[childId]));
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
    stories: Object.values(index.stories).reduce((acc, entry) => {
      acc[entry.id] = {
        ...entry,
        title: entry.kind,
        name: entry.name || entry.story,
        importPath: entry.parameters.fileName || '',
      };

      return acc;
    }, {} as StoryIndexV3['stories']),
  };
};

export const transformStoryIndexV3toV4 = (index: StoryIndexV3): API_PreparedStoryIndex => {
  const countByTitle = countBy(Object.values(index.stories), 'title');
  return {
    v: 4,
    entries: Object.values(index.stories).reduce((acc, entry: any) => {
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
    }, {} as API_PreparedStoryIndex['entries']),
  };
};
