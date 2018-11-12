import qs from 'qs';

const initStoriesApi = ({ store, navigate }) => {
  const storiesApi = {
    getUrlData(l) {
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
    },
    jumpToStory(direction) {
      const state = store.getState();
      const { storiesHash } = state;
      const { componentRoot, component } = storiesApi.getUrlData();
      let selectedId = component;

      const lookupList = Object.keys(storiesHash).filter(
        k => !(storiesHash[k].children || Array.isArray(storiesHash[k]))
      );

      if (!selectedId || !storiesHash[selectedId]) {
        selectedId = state.selectedId || Object.keys(storiesHash)[0];
      }
      const index = lookupList.indexOf(selectedId);

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

      if (componentRoot) {
        navigate(`/${componentRoot}/${result}`);
        store.setState({ selectedId: result });
      }
    },
    jumpToComponent(direction) {
      const state = store.getState();
      const { storiesHash, viewMode, componentId } = state;
      let selectedId = componentId || state.selectedId;

      const dirs = Object.entries(storiesHash).reduce((acc, i) => {
        const key = i[0];
        const value = i[1];
        if (value.isComponent) {
          acc[key] = [...i[1].children];
        }
        return acc;
      }, []);

      const idx = Object.values(dirs).findIndex(i => i.includes(selectedId));

      if (!selectedId || !storiesHash[selectedId]) {
        selectedId = state.selectedId || Object.keys(storiesHash)[0];
      }

      // cannot navigate beyond fist or last
      if (idx === dirs.length - 1 && direction > 0) {
        return;
      }
      if (idx === 0 && direction < 0) {
        return;
      }
      if (direction === 0) {
        return;
      }

      const result = dirs[idx + direction];

      navigate(`/${viewMode || 'components'}/${result}`);
    },

    getUrlState() {
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
    },

    setStories(storiesHash) {
      const { componentId, viewMode } = store.getState();
      store.setState({ storiesHash });

      // when there's no selectedId or the selectedId item doesn't exist
      // we try to resolve from state or pick the first leaf and navigate
      if (!componentId || !storiesHash[componentId]) {
        const firstLeaf = Object.values(storiesHash).find(s => !s.children).path;

        if (viewMode) {
          navigate(`/${viewMode}/${componentId || firstLeaf}`);
        }
        store.setState({ selectedId: componentId || firstLeaf });
      } else {
        store.setState({ selectedId: componentId });
      }
    },

    selectStory(kind, story, { location } = {}) {
      let selectedId;
      const state = store.getState();

      if (location) {
        const { storiesHash } = state;

        const { componentRoot, component } = storiesApi.getUrlData(location);
        selectedId = component;

        if (!selectedId || !storiesHash[selectedId]) {
          selectedId = state.selectedId || Object.keys(storiesHash)[0];
        }

        if (componentRoot) {
          navigate(`/${componentRoot}/${component}`);
        }

        store.setState({ selectedId });
      } else {
        throw new Error('NOT ALLOWED, must use location!');
      }
    },

    selectInCurrentKind(name) {
      const { componentRoot, component } = storiesApi.getUrlData();
      const selectedId = component.replace(/([^-]+)$/, name);

      if (componentRoot) {
        navigate(`/${componentRoot}/${selectedId}`);
      }

      store.setState({ selectedId });
    },
  };
  return storiesApi;
};
export default initStoriesApi;
