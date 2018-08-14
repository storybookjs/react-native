import { observable, action, set } from 'mobx';
import pick from 'lodash.pick';
import { themes } from '@storybook/components';

import { features } from './libs/key_events';

function ensureKind(stories, selectedKind) {
  if (stories.length === 0) return selectedKind;

  const found = stories.find(item => item.kind === selectedKind);
  if (found) return selectedKind;

  // if the selected kind is non-existant, select the first kind
  return stories[0].kind;
}

function ensureStory(stories, selectedKind, selectedStory) {
  if (!stories.length === 0) return selectedStory;

  const kindInfo = stories.find(item => item.kind === selectedKind);
  if (!kindInfo) return null;

  const found = kindInfo.stories.find(item => item === selectedStory);
  if (found) return found;

  // if the selected story is non-existant, select the first story
  return kindInfo.stories[0];
}

export function ensurePanel(panels, selectedPanel, currentPanel) {
  const keys = Object.keys(panels);

  if (keys.indexOf(selectedPanel) >= 0) {
    return selectedPanel;
  }

  if (keys.length) {
    return keys[0];
  }
  return currentPanel;
}

const createStore = ({ provider }) => {
  const store = observable(
    {
      stories: [],
      storyFilter: null,
      shortcutOptions: {
        full: false,
        nav: true,
        panel: 'right',
        // showSearchBox: false,
        // addonPanelInRight: false,
        enableShortcuts: true,
      },
      uiOptions: {
        name: 'STORYBOOK',
        url: 'https://github.com/storybooks/storybook',
        sortStoriesByKind: false,
        hierarchySeparator: '/',
        hierarchyRootSeparator: '|',
        sidebarAnimations: true,
        theme: themes.normal,
      },
      customQueryParams: {},

      get Preview() {
        return () => provider.renderPreview(this.selectedKind, this.selectedStory);
      },

      selectedPanelValue: null,
      get selectedPanel() {
        return ensurePanel(this.panels, this.selectedPanelValue, this.selectedPanelValue);
      },
      set selectedPanel(value) {
        this.selectedPanelValue = value;
      },

      get panels() {
        return provider.getPanels();
      },

      setOptions(options) {
        const { selectedPanel, ...uiOptions } = options;
        const newOptions = pick(uiOptions, Object.keys(this.uiOptions));

        if (selectedPanel) {
          set(this.selectedPanel, ensurePanel(this.panels, selectedPanel, this.selectedPanel));
        }

        set(this.uiOptions, newOptions);
      },

      setShortcutsOptions(options) {
        set(this.shortcutOptions, pick(options, Object.keys(this.shortcutOptions)));
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
            this.shortcutOptions.full = !this.shortcutOptions.full;
            break;
          }
          case features.ADDON_PANEL: {
            // TODO: would be nice to recover to previous setting (was maybe 'bottom')
            this.shortcutOptions.panel = this.shortcutOptions.panel ? false : 'right';
            break;
          }
          case features.STORIES_PANEL: {
            this.shortcutOptions.nav = !this.shortcutOptions.nav;
            break;
          }
          case features.SHOW_SEARCH: {
            this.toggleSearchBox();
            break;
          }
          case features.ADDON_PANEL_IN_RIGHT: {
            this.shortcutOptions.panel =
              this.shortcutOptions.panel === 'bottom' ? 'right' : 'bottom';
            break;
          }
          default:
            break;
        }
      },

      get urlState() {
        return {
          selectedKind: this.selectedKind,
          selectedStory: this.selectedStory,
          selectedPanel: this.selectedPanel,
          full: Number(Boolean(this.shortcutOptions.full)),
          panel:
            this.shortcutOptions.panel === 'right' || this.shortcutOptions.panel === 'bottom'
              ? this.shortcutOptions.panel
              : false,
          nav: Number(Boolean(this.shortcutOptions.nav)),
          ...this.customQueryParams,
        };
      },

      toggleSearchBox() {
        // this.shortcutOptions.showSearchBox = !this.shortcutOptions.showSearchBox;
      },

      /** UI actions */
      setStoryFilter(filter) {
        this.storyFilter = filter;
      },

      selectAddonPanel(panelName) {
        this.selectedPanel = panelName;
      },

      setStories(stories) {
        const selectedKind = ensureKind(stories, this.selectedKind);
        const currentSelectedStory = this.selectedKind === selectedKind ? this.selectedStory : null;
        const selectedStory = ensureStory(stories, selectedKind, currentSelectedStory);

        this.stories = stories;
        this.selectedStory = selectedStory;
        this.selectedKind = selectedKind;
      },

      selectStory(kind, story) {
        const selectedKind = ensureKind(this.stories, kind);
        const selectedStory = ensureStory(this.stories, selectedKind, story);

        this.selectedStory = selectedStory;
        this.selectedKind = selectedKind;
      },

      selectInCurrentKind(story) {
        const selectedStory = ensureStory(this.stories, this.selectedKind, story);

        this.selectedStory = selectedStory;
      },

      setQueryParams(customQueryParams) {
        set(
          this.customQueryParams,
          Object.keys(customQueryParams).reduce((acc, key) => {
            if (customQueryParams[key] !== null) acc[key] = customQueryParams[key];
            return acc;
          }, {})
        );
      },

      updateFromLocation(params) {
        const {
          selectedKind,
          selectedStory,
          addonPanel,
          full = 0,
          panel = 'bottom',
          nav = true,
          ...customQueryParams
        } = params;

        if (selectedKind) {
          this.selectedKind = selectedKind;
          this.selectedStory = selectedStory;
        }

        this.setShortcutsOptions({
          full: Boolean(Number(full)),
          panel: panel === 'bottom' || panel === 'right' ? panel : false,
          nav: Boolean(Number(nav)),
        });

        if (addonPanel) {
          this.selectAddonPanel(addonPanel);
        }

        this.setQueryParams(customQueryParams);
      },
    },
    {
      setOptions: action,
      setShortcutsOptions: action,
      jumpToStory: action,
      handleEvent: action,
      toggleSearchBox: action,
      setStoryFilter: action,
      selectAddonPanel: action,
      setStories: action,
      selectStory: action,
      selectInCurrentKind: action,
      setQueryParams: action,
      updateFromLocation: action,
    }
  );

  return store;
};

export default createStore;
