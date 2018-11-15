import qs from 'qs';

const initStoriesApi = ({ store, navigate }) => {
  const getUrlData = l => {
    // TODO: remove
    const { location } = store.getState();
    const { search } = l || location;
    const { path = '' } = qs.parse(search, { ignoreQueryPrefix: true });
    const [, p1, p2] = path.match(/\/([^/]+)\/([^/]+)?/) || [];

    const result = {};
    if (p1 && p1.match(/(components|info)/)) {
      Object.assign(result, {
        componentRoot: p1,
        component: p2,
      });
    }
    return result;
  };

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

  const getUrlState = () => {
    // TODO: remove
    const state = store.getState();

    return {
      selectedKind: state.selectedKind,
      selectedStory: state.selectedStory,
      selectedPanel: state.selectedPanel,
      full: Number(Boolean(state.shortcutOptions.full)),
      panel:
        state.shortcutOptions.panel === 'right' || state.shortcutOptions.panel === 'bottom'
          ? state.shortcutOptions.panel
          : false,
      nav: Number(Boolean(state.shortcutOptions.nav)),
      ...state.customQueryParams,
    };
  };

  const setStories = storiesHash => {
    const { componentId, viewMode, legacy_selectedKind, legacy_selectedStory } = store.getState();

    // some realy old link with storyname and storykind came in
    // map it to a componentId and navigate
    if (legacy_selectedKind && legacy_selectedStory) {
      const legacyId = legacy_convertToComponentId({
        legacy_selectedKind,
        legacy_selectedStory,
        storiesHash,
      });

      if (storiesHash[legacyId]) {
        if (viewMode) {
          navigate(`/${viewMode}/${legacyId}`);
        }
      }
    } else if (!componentId || !storiesHash[componentId]) {
      // when there's no componentId or the componentId item doesn't exist
      // we pick the first leaf and navigate
      const firstLeaf = findFirstLeaf(storiesHash);

      if (viewMode) {
        navigate(`/${viewMode}/${firstLeaf}`);
      }
    }

    store.setState({ storiesHash });
  };

  const legacy_convertToComponentId = ({ storiesHash, selectedKind, selectedStory }) =>
    Object.entries(storiesHash).find(
      ([, v]) => v.kind === selectedKind && v.name === selectedStory
    )[0];

  const legacy_selectStory = ({ storiesHash, selectedKind, selectedStory }) => {
    if (selectedKind && selectedStory) {
      const selectedId = legacy_convertToComponentId({
        storiesHash,
        selectedKind,
        selectedStory,
      });

      if (selectedId) {
        selectStory(selectedId);
      } else {
        store.setState({
          legacy_selectedKind: selectedKind,
          legacy_selectedStory: selectedStory,
        });
      }
    }
  };

  const selectStory = (a, b) => {
    const { storiesHash, viewMode = 'components' } = store.getState();
    if (!b) {
      const selectedId = a;

      if (selectedId && storiesHash[selectedId]) {
        navigate(`/${viewMode}/${selectedId}`);
      } else {
        console.error('you tried to select a story that does not exist');
      }
    } else {
      const selectedKind = a;
      const selectedStory = b;

      legacy_selectStory({
        storiesHash,
        selectedKind,
        selectedStory,
      });
    }
  };

  const selectInCurrentKind = name => {
    const { viewmode, componentId } = store.getState();
    const selectedId = componentId.replace(/([^-]+)$/, name);

    if (viewmode) {
      navigate(`/${viewmode}/${selectedId}`);
    }
  };
  return {
    selectInCurrentKind,
    selectStory,
    legacy_selectStory,
    legacy_convertToComponentId,
    setStories,
    getUrlState,
    jumpToComponent,
    jumpToStory,
    getUrlData,
  };
};
export default initStoriesApi;
