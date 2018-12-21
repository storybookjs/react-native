import toId from '../libs/id';

const initStoriesApi = ({
  store,
  navigate,
  componentId: initialComponentId,
  viewMode: initialViewMode,
}) => {
  const findFirstLeaf = storiesHash => Object.values(storiesHash).find(s => !s.children).path;

  const jumpToStory = direction => {
    const { storiesHash, viewMode, componentId } = store.getState();

    // cannot navigate when there's no current selection
    if (!componentId || !storiesHash[componentId]) {
      return;
    }

    const lookupList = Object.keys(storiesHash).filter(
      k => !(storiesHash[k].children || Array.isArray(storiesHash[k]))
    );
    const index = lookupList.indexOf(componentId);

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

  const getData = componentId => {
    const { storiesHash } = store.getState();

    return storiesHash[componentId];
  };

  const getParameters = (componentId, addon) => {
    const data = getData(componentId);
    if (!data) {
      return null;
    }
    const { parameters } = data;
    return addon ? parameters[addon] : parameters;
  };

  const jumpToComponent = direction => {
    const state = store.getState();
    const { storiesHash, viewMode, componentId } = state;

    // cannot navigate when there's no current selection
    if (!componentId || !storiesHash[componentId]) {
      return;
    }

    const lookupList = Object.entries(storiesHash).reduce((acc, i) => {
      const value = i[1];
      if (value.isComponent) {
        acc.push([...i[1].children]);
      }
      return acc;
    }, []);

    const index = lookupList.findIndex(i => i.includes(componentId));

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

  const setStories = storiesHash => {
    const { componentId, viewMode } = store.getState();

    if (!componentId || !storiesHash[componentId]) {
      // when there's no componentId or the componentId item doesn't exist
      // we pick the first leaf and navigate
      const firstLeaf = findFirstLeaf(storiesHash);

      if (viewMode) {
        navigate(`/${viewMode}/${firstLeaf}`);
      }
    }

    store.setState({ storiesHash });
  };

  const selectStory = (kindOrId, story) => {
    const { viewMode = 'components', componentId } = store.getState();
    if (!story) {
      navigate(`/${viewMode}/${kindOrId}`);
    } else if (!kindOrId) {
      // This is a slugified version of the kind, but that's OK, our toId function is idempotent
      const kind = componentId.split('--', 2)[0];
      selectStory(toId(kind, story));
    } else {
      selectStory(toId(kindOrId, story));
    }
  };

  return {
    api: {
      selectStory,
      setStories,
      jumpToComponent,
      jumpToStory,
      getData,
      getParameters,
    },
    state: {
      storiesHash: {},
      componentId: initialComponentId,
      viewMode: initialViewMode,
    },
  };
};
export default initStoriesApi;
