const createStore = (initialState = {}) => {
  const internalState = { ...initialState };

  return {
    getAll() {
      return internalState;
    },
  };
};

export default createStore({
  showShortcutsHelp: false,
  storyFilter: null,
  selectedAddonPanel: null,
  isMobileDevice: false,
  shortcutOptions: {
    goFullScreen: false,
    showStoriesPanel: true,
    showAddonPanel: true,
    showSearchBox: false,
    addonPanelInRight: false,
    enableShortcuts: true,
  },
  uiOptions: {
    name: 'STORYBOOK',
    url: 'https://github.com/storybooks/storybook',
    sortStoriesByKind: false,
    hierarchySeparator: '/',
    hierarchyRootSeparator: null,
    sidebarAnimations: true,
    theme: null,
  },
});
