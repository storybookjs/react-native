import mergeWith from 'lodash.mergewith';
import isEqual from 'lodash.isequal';
import toId, { sanitize } from '../libs/id';

const merge = (a, b) =>
  mergeWith(a, b, (objValue, srcValue) => {
    if (Array.isArray(srcValue) && Array.isArray(objValue)) {
      srcValue.forEach(s => {
        const existing = objValue.find(o => o === s || isEqual(o, s));
        if (!existing) {
          objValue.push(s);
        }
      });

      return objValue;
    }
    if (Array.isArray(objValue)) {
      // eslint-disable-next-line no-console
      console.log('the types mismatch, picking', objValue);
      return objValue;
    }
    return undefined;
  });

const initStoriesApi = ({
  store,
  navigate,
  storyId: initialStoryId,
  viewMode: initialViewMode,
}) => {
  const findFirstLeaf = storiesHash => Object.values(storiesHash).find(s => !s.children).path;

  const jumpToStory = direction => {
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
    if (direction === 0) {
      return;
    }

    const result = lookupList[index + direction];

    if (viewMode && result) {
      navigate(`/${viewMode}/${result}`);
    }
  };

  const getData = storyId => {
    const { storiesHash } = store.getState();

    return storiesHash[storyId];
  };

  const getParameters = (storyId, addon) => {
    const data = getData(storyId);
    if (!data) {
      return null;
    }
    const { parameters } = data;
    return addon ? parameters[addon] : parameters;
  };

  const jumpToComponent = direction => {
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
    if (direction === 0) {
      return;
    }

    const result = lookupList[index + direction][0];

    navigate(`/${viewMode || 'components'}/${result}`);
  };

  const splitPath = (kind, { rootSeparator, groupSeparator }) => {
    const [root, remainder] = kind.split(rootSeparator, 2);
    const groups = (remainder || kind).split(groupSeparator).filter(i => !!i);

    // when there's no remainder, it means the root wasn't found/split
    return {
      root: remainder ? root : null,
      groups,
    };
  };

  const toKey = input =>
    input.replace(/[^a-z0-9]+([a-z0-9])/gi, (...params) => params[1].toUpperCase());

  const toGroup = name => ({
    name,
    children: [],
    id: toKey(name),
  });

  const setStories = input => {
    const storiesHash = Object.values(input).reduce((acc, item) => {
      const { kind, parameters } = item;
      const {
        hierarchyRootSeparator: rootSeparator,
        hierarchySeparator: groupSeparator,
      } = parameters.options;

      const { root, groups } = splitPath(kind, { rootSeparator, groupSeparator });

      const rootAndGroups = []
        .concat(root || [])
        .concat(groups)
        .map(toGroup)
        // Map a bunch of extra fields onto the groups, collecting the path as we go (thus the reduce)
        .reduce((soFar, group, index, original) => {
          const { name } = group;
          const parent = index > 0 && soFar[index - 1].id;
          const id = sanitize(parent ? `${parent}-${name}` : name);
          return soFar.concat([
            {
              ...group,
              id,
              parent,
              depth: index,
              isComponent: index === original.length - 1,
              isRoot: index === 0,
            },
          ]);
        }, []);

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

      acc[item.id] = { ...item, parent: rootAndGroups.map(g => g.id).join('') };

      return acc;
    }, {});

    const { storyId, viewMode } = store.getState();

    if (!storyId || !storiesHash[storyId]) {
      // when there's no storyId or the storyId item doesn't exist
      // we pick the first leaf and navigate
      const firstLeaf = findFirstLeaf(storiesHash);

      if (viewMode) {
        navigate(`/${viewMode}/${firstLeaf}`);
      }
    }

    store.setState({ storiesHash });
  };

  const selectStory = (kindOrId, story) => {
    const { viewMode = 'components', storyId } = store.getState();
    if (!story) {
      navigate(`/${viewMode}/${kindOrId}`);
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
    },
  };
};
export default initStoriesApi;
