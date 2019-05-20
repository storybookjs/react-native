// FIXME: we shouldn't import from dist but there are no types otherwise
import { toId, sanitize, parseKind } from '@storybook/router';

import { Module } from '../index';
import merge from '../lib/merge';

type Direction = -1 | 1;
type StoryId = string;
type ParameterName = string;

type ViewMode = 'story' | 'info' | undefined;

export interface SubState {
  storiesHash: StoriesHash;
  storyId: StoryId;
  viewMode: ViewMode;
  storiesConfigured: boolean;
}

export interface SubAPI {
  storyId: typeof toId;
  selectStory: (kindOrId: string, story?: string, obj?: any) => void;
  getCurrentStoryData: () => Story | Group;
  setStories: (stories: StoriesRaw) => void;
  jumpToComponent: (direction: Direction) => void;
  jumpToStory: (direction: Direction) => void;
  getData: (storyId: StoryId) => Story | Group;
  getParameters: (storyId: StoryId, parameterName?: ParameterName) => Story['parameters'] | any;
}

interface Group {
  id: StoryId;
  name: string;
  children: StoryId[];
  parent: StoryId;
  depth: number;
  isComponent: boolean;
  isRoot: boolean;
  isLeaf: boolean;
}

interface StoryInput {
  id: StoryId;
  name: string;
  kind: string;
  children: string[];
  parameters: {
    filename: string;
    options: {
      hierarchyRootSeparator: RegExp;
      hierarchySeparator: RegExp;
      [key: string]: any;
    };
    [parameterName: string]: any;
  };
  isLeaf: boolean;
}

type Story = StoryInput & Group;

export interface StoriesHash {
  [id: string]: Group | Story;
}
export type StoriesList = (Group | Story)[];
export type GroupsList = Group[];

export interface StoriesRaw {
  [id: string]: StoryInput;
}

const initStoriesApi = ({
  store,
  navigate,
  storyId: initialStoryId,
  viewMode: initialViewMode,
}: Module) => {
  const isStory = (obj: Group | Story): boolean => {
    const story = obj as Story;
    return !!(story && story.parameters);
  };

  const getData = (storyId: StoryId) => {
    const { storiesHash } = store.getState();

    return storiesHash[storyId];
  };
  const getCurrentStoryData = () => {
    const { storyId } = store.getState();

    return getData(storyId);
  };
  const getParameters = (storyId: StoryId, parameterName?: ParameterName) => {
    const data = getData(storyId);

    if (isStory(data)) {
      const { parameters } = data as Story;
      return parameterName ? parameters[parameterName] : parameters;
    }

    return null;
  };

  const jumpToStory = (direction: Direction) => {
    const { storiesHash, viewMode, storyId } = store.getState();

    // cannot navigate when there's no current selection
    if (!storyId || !storiesHash[storyId]) {
      return;
    }

    const lookupList = Object.keys(storiesHash).filter(
      k => !(storiesHash[k].children || Array.isArray(storiesHash[k]))
    );
    const index = lookupList.indexOf(storyId);

    // cannot navigate beyond fist or last
    if (index === lookupList.length - 1 && direction > 0) {
      return;
    }
    if (index === 0 && direction < 0) {
      return;
    }

    const result = lookupList[index + direction];

    if (viewMode && result) {
      navigate(`/${viewMode}/${result}`);
    }
  };

  const jumpToComponent = (direction: Direction) => {
    const state = store.getState();
    const { storiesHash, viewMode, storyId } = state;

    // cannot navigate when there's no current selection
    if (!storyId || !storiesHash[storyId]) {
      return;
    }

    const lookupList = Object.entries(storiesHash).reduce((acc, i) => {
      const value = i[1];
      if (value.isComponent) {
        acc.push([...i[1].children]);
      }
      return acc;
    }, []);

    const index = lookupList.findIndex(i => i.includes(storyId));

    // cannot navigate beyond fist or last
    if (index === lookupList.length - 1 && direction > 0) {
      return;
    }
    if (index === 0 && direction < 0) {
      return;
    }

    const result = lookupList[index + direction][0];

    navigate(`/${viewMode || 'story'}/${result}`);
  };

  const toKey = (input: string) =>
    input.replace(/[^a-z0-9]+([a-z0-9])/gi, (...params) => params[1].toUpperCase());

  const toGroup = (name: string) => ({
    name,
    id: toKey(name),
  });

  const setStories = (input: StoriesRaw) => {
    const hash: StoriesHash = {};
    const storiesHashOutOfOrder = Object.values(input).reduce((acc, item) => {
      const { kind, parameters } = item;
      // FIXME: figure out why parameters is missing when used with react-native-server
      const {
        hierarchyRootSeparator: rootSeparator,
        hierarchySeparator: groupSeparator,
      } = (parameters && parameters.options) || {
        hierarchyRootSeparator: '|',
        hierarchySeparator: '/',
      };

      const { root, groups } = parseKind(kind, { rootSeparator, groupSeparator });

      const rootAndGroups = []
        .concat(root || [])
        .concat(groups)
        .map(toGroup)
        // Map a bunch of extra fields onto the groups, collecting the path as we go (thus the reduce)
        .reduce(
          (soFar, group, index, original) => {
            const { name } = group;
            const parent = index > 0 && soFar[index - 1].id;
            const id = sanitize(parent ? `${parent}-${name}` : name);
            if (parent === id) {
              throw new Error(
                `
Invalid part '${name}', leading to id === parentId ('${id}'), inside kind '${kind}'

Did you create a path that uses the separator char accidentally, such as 'Vue <docs/>' where '/' is a separator char? See https://github.com/storybooks/storybook/issues/6128
              `.trim()
              );
            }

            const result: Group = {
              ...group,
              id,
              parent,
              depth: index,
              children: [],
              isComponent: index === original.length - 1,
              isLeaf: false,
              isRoot: !!root && index === 0,
            };
            return soFar.concat([result]);
          },
          [] as GroupsList
        );

      const paths = [...rootAndGroups.map(g => g.id), item.id];

      // Ok, now let's add everything to the store
      rootAndGroups.forEach((group, index) => {
        const child = paths[index + 1];
        const { id } = group;
        acc[id] = merge(acc[id] || {}, {
          ...group,
          ...(child && { children: [child] }),
        });
      });

      const story = { ...item, parent: rootAndGroups[rootAndGroups.length - 1].id, isLeaf: true };
      acc[item.id] = story as Story;

      return acc;
    }, hash);

    // When adding a group, also add all of its children, depth first
    function addItem(acc: StoriesHash, item: Story | Group) {
      if (!acc[item.id]) {
        // If we were already inserted as part of a group, that's great.
        acc[item.id] = item;
        const { children } = item;
        if (children) {
          children.forEach(id => addItem(acc, storiesHashOutOfOrder[id]));
        }
      }
      return acc;
    }

    // Now create storiesHash by reordering the above by group
    const storiesHash: StoriesHash = Object.values(storiesHashOutOfOrder).reduce(addItem, {});

    const { storyId, viewMode } = store.getState();

    if (storyId && storyId.match(/--\*$/)) {
      const idStart = storyId.slice(0, -1); // drop the * at the end
      const firstKindLeaf = Object.values(storiesHash).find(
        (s: Story | Group) => !s.children && s.id.substring(0, idStart.length) === idStart
      );

      if (viewMode && firstKindLeaf) {
        navigate(`/${viewMode}/${firstKindLeaf.id}`);
      }
    } else if (!storyId || storyId === '*' || !storiesHash[storyId]) {
      // when there's no storyId or the storyId item doesn't exist
      // we pick the first leaf and navigate
      const firstLeaf = Object.values(storiesHash).find((s: Story | Group) => !s.children);

      if (viewMode && firstLeaf) {
        navigate(`/${viewMode}/${firstLeaf.id}`);
      }
    }

    store.setState({
      storiesHash,
      storiesConfigured: true,
    });
  };

  const selectStory = (kindOrId: string, story?: string) => {
    const { viewMode = 'story', storyId, storiesHash } = store.getState();
    if (!story) {
      const s = storiesHash[sanitize(kindOrId)];
      // eslint-disable-next-line no-nested-ternary
      const id = s ? (s.children ? s.children[0] : s.id) : kindOrId;
      navigate(`/${viewMode}/${id}`);
    } else if (!kindOrId) {
      // This is a slugified version of the kind, but that's OK, our toId function is idempotent
      const kind = storyId.split('--', 2)[0];
      selectStory(toId(kind, story));
    } else {
      selectStory(toId(kindOrId, story));
    }
  };

  return {
    api: {
      storyId: toId,
      selectStory,
      getCurrentStoryData,
      setStories,
      jumpToComponent,
      jumpToStory,
      getData,
      getParameters,
    },
    state: {
      storiesHash: {},
      storyId: initialStoryId,
      viewMode: initialViewMode,
      storiesConfigured: false,
    },
  };
};
export default initStoriesApi;
