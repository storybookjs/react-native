import { observable } from 'mobx';
import { features } from './libs/key_events';

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
  const store = observable({
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

    jumpToStory(direction) {
      const flatteredStories = [];
      let currentIndex = -1;

      this.stories.forEach(({ kind, stories }) => {
        stories.forEach(story => {
          flatteredStories.push({ kind, story });
          if (kind === this.selectedKind && story === this.selectedStory) {
            currentIndex = flatteredStories.length - 1;
          }
        });
      });

      const jumpedStory = flatteredStories[currentIndex + direction];
      if (!jumpedStory) {
        return;
      }

      this.selectedKind = jumpedStory.kind;
      this.selectedStory = jumpedStory.story;
    },

    handleEvent(event) {
      if (!this.shortcutOptions.enableShortcuts) return;

      switch (event) {
        case features.NEXT_STORY: {
          this.jumpToStory(1);
          break;
        }
        case features.PREV_STORY: {
          this.jumpToStory(-1);
          break;
        }
        case features.FULLSCREEN: {
          this.shortcutOptions.goFullScreen = !this.shortcutOptions
            .goFullScreen;
          break;
        }
        case features.ADDON_PANEL: {
          this.shortcutOptions.showAddonPanel = !this.shortcutOptions
            .showAddonPanel;
          break;
        }
        case features.STORIES_PANEL: {
          this.shortcutOptions.showStoriesPanel = !this.shortcutOptions
            .showStoriesPanel;
          break;
        }
        case features.SHOW_SEARCH: {
          this.toggleSearchBox();
          break;
        }
        case features.ADDON_PANEL_IN_RIGHT: {
          this.shortcutOptions.addonPanelInRight = !this.shortcutOptions
            .addonPanelInRight;
        }
        default:
          return;
      }
    },

    toggleSearchBox() {
      this.shortcutOptions.showSearchBox = !this.shortcutOptions.showSearchBox;
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
    },

    selectStory(kind, story) {
      const selectedKind = ensureKind(this.stories, kind);
      const selectedStory = ensureStory(this.stories, selectedKind, story);

      this.selectedStory = selectedStory;
      this.selectedKind = selectedKind;
    }
  });

  return store;
};

export default createStore;
