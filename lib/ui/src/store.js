import { observable, action, set } from 'mobx';
import pick from 'lodash.pick';

import { features } from './libs/key_events';
import checkIfMobileDevice from './modules/ui/libs/is_mobile_device';

const { userAgent } = global.window.navigator;
const isMobileDevice = checkIfMobileDevice(userAgent);

const deprecationMessage = (oldName, newName) =>
  `The ${oldName} option has been renamed to ${newName} and will not be available in the next major Storybook release. Please update your config.`;

const renamedOptions = {
  showLeftPanel: 'showStoriesPanel',
  showDownPanel: 'showAddonPanel',
  downPanelInRight: 'addonPanelInRight'
};

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

export function ensurePanel(panels, selectedPanel, currentPanel) {
  if (Object.keys(panels).indexOf(selectedPanel) >= 0) return selectedPanel;
  // if the selected panel is non-existant, select the current panel
  // and output to console all available panels
  const logger = console;
  logger.group('Available Panels ID:');
  Object.keys(panels).forEach(panelID =>
    logger.log(`${panelID} (${panels[panelID].title})`)
  );
  logger.groupEnd('Available Panels ID:');
  return currentPanel;
}

const createStore = () => {
  const store = observable(
    {
      showShortcutsHelp: false,
      storyFilter: null,
      selectedAddonPanel: null,
      isMobileDevice,
      shortcutOptions: {
        goFullScreen: false,
        showStoriesPanel: !isMobileDevice,
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

      setOptions(options) {
        const newOptions = pick(options, Object.keys(this.uiOptions));
        set(this.uiOptions, newOptions);

        if (options.hasOwnProperty('selectedAddonPanel')) {
          this.selectedAddonPanel = ensurePanel(
            provider.getPanels(),
            options.selectedAddonPanel,
            this.selectedAddonPanel
          );
        }
      },

      setShortcutsOptions(options) {
        const updatedOptions = {
          ...this.shortcutOptions,
          ...pick(options, Object.keys(this.shortcutOptions))
        };

        const withNewNames = Object.keys(renamedOptions).reduce(
          (acc, oldName) => {
            const newName = renamedOptions[oldName];

            if (oldName in options && !(newName in options)) {
              if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.warn(deprecationMessage(oldName, newName));
              }

              return {
                ...acc,
                [newName]: options[oldName]
              };
            }

            return acc;
          },
          updatedOptions
        );

        set(this.shortcutOptions, withNewNames);
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
        this.shortcutOptions.showSearchBox = !this.shortcutOptions
          .showSearchBox;
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
      },

      selectInCurrentKind(story) {
        const selectedStory = ensureStory(
          state.stories,
          state.selectedKind,
          story
        );

        this.selectedStory = selectedStory;
      },

      setQueryParams(customQueryParams) {
        const updatedQueryParams = {
          ...this.customQueryParams,
          ...customQueryParams
        };

        Object.keys(customQueryParams).forEach(key => {
          if (updatedQueryParams[key] === null) {
            delete updatedQueryParams[key];
          }
        });

        this.customQueryParams = updatedQueryParams;
      }
    },
    {
      setOptions: action,
      setShortcutsOptions: action,
      jumpToStory: action,
      handleEvent: action,
      toggleSearchBox: action,
      setStoryFilter: action,
      toggleShortcutsHelp: action,
      selectAddonPanel: action,
      setStories: action,
      selectStory: action,
      selectInCurrentKind: action,
      setQueryParams: action
    }
  );

  return store;
};

export default createStore;
