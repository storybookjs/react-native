import { observable, observe, action } from 'mobx';

function ensureKind(storyKinds, selectedKind) {
  if (!storyKinds) return selectedKind;

  const found = storyKinds.find(item => item.kind === selectedKind);
  if (found) return found.kind;
  // if the selected kind is non-existant, select the first kind
  const kinds = storyKinds.map(item => item.kind);
  return kinds[0];
}

function ensureStory(storyKinds, selectedKind, selectedStory) {
  if (!storyKinds) return selectedStory;

  const kindInfo = storyKinds.find(item => item.kind === selectedKind);
  if (!kindInfo) return null;

  const found = kindInfo.stories.find(item => item === selectedStory);
  if (found) return found;

  // if the selected story is non-existant, select the first story
  return kindInfo.stories[0];
}

const createStore = () => {
  const store = observable(
    {
      stories: [],
      selectedKind: undefined,
      selectedStory: undefined,
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
        enableShortcuts: true
      },
      uiOptions: {
        name: 'STORYBOOK',
        url: 'https://github.com/storybooks/storybook',
        sortStoriesByKind: false,
        hierarchySeparator: '/',
        hierarchyRootSeparator: null,
        sidebarAnimations: true,
        theme: null
      },

      /** UI actions */
      setStoryFilter(filter) {
        this.storyFilter = filter;
      },

      toggleShortcutsHelp() {
        this.showShortcutsHelp = !this.showShortcutsHelp;
      },

      selectAddonPanel(panelName) {
        this.selectedAddonPanel = panelName;
      },

      setStories(stories) {
        const selectedKind = ensureKind(stories, this.selectedKind);
        const currentSelectedStory =
          this.selectedKind === selectedKind ? this.selectedStory : null;
        const selectedStory = ensureStory(
          stories,
          selectedKind,
          currentSelectedStory
        );

        this.stories = stories;
        this.selectedStory = selectedStory;
        this.selectedKind = selectedKind;
      }
    },
    {
      setStoryFilter: action,
      toggleShortcutsHelp: action,
      selectAddonPanel: action,
      setStories: action
    }
  );

  observe(store, change => {
    console.log('Store updated', change);
  });

  return store;
};

export default createStore;
