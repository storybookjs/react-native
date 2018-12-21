import toId from '../libs/id';

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

  const setStories = storiesHash => {
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
