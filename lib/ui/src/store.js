import { observable, action, set } from 'mobx';
import pick from 'lodash.pick';
import { themes } from '@storybook/components';
import { navigate } from './router';
import { toNested, splitPath, toKey } from './libs/nav/nav';

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
  if (!kindInfo) return selectedStory;

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

// TODO: these are copies from components/nav/lib
// refactor to DRY
export const isRoot = (k, v) => k == v.id;
export const toId = (base, addition) => (base === '' ? `${addition}` : `${base}-${addition}`);
export const toDataset = (input, path = '', output = {}) =>
  input.reduce((acc, i) => {
    const p = toId(path, i.id);
    if (i.children) {
      toDataset(i.children, p, acc);
    }

    return Object.assign(acc, {
      root: [].concat(acc.root || []).concat(isRoot(p, i) ? p : []),
      [p]: Object.assign(
        {},
        i,
        {
          isExpanded: !!i.isExpanded,
          isSelected: !!i.isSelected,
          path: p,
          pid: path,
        },
        i.children ? { children: i.children.map(c => toId(p, c.id)) } : {}
      ),
    });
  }, output);

const createStore = ({ provider }) => {
  const store = observable(
    {
      stories: [],
      storiesHash: {},
      // storyFilter: null,
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
      notifications: [
        {
          id: 'update',
          level: 2,
          link: '/settings',
          content: `There's a new version available: 4.0.0`,
        },
      ],

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
      get channel() {
        return provider.channel;
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
        console.log('jumpToStory');
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

        const {
          hierarchyRootSeparator: rootSeperator,
          hierarchySeparator: groupSeperator,
        } = this.uiOptions;

        const { root, groups = [] } = splitPath(jumpedStory.kind, {
          rootSeperator,
          groupSeperator,
        });
        const selectedId = []
          .concat(root || [])
          .concat(groups)
          .filter(Boolean)
          .concat(jumpedStory.story)
          .map(toKey)
          .join('-');

        console.log('navigate');
        navigate(`/components/${selectedId}`);
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
      // setStoryFilter(filter) {
      //   this.storyFilter = filter;
      // },

      selectAddonPanel(panelName) {
        this.selectedPanel = panelName;
      },

      setStories(stories) {
        console.log('setStories');

        const selectedKind = ensureKind(stories, this.selectedKind);
        const currentSelectedStory = this.selectedKind === selectedKind ? this.selectedStory : null;
        const selectedStory = ensureStory(stories, selectedKind, currentSelectedStory);

        const {
          hierarchyRootSeparator: rootSeperator,
          hierarchySeparator: groupSeperator,
        } = this.uiOptions;

        this.stories = stories;
        this.selectedKind = selectedKind;
        this.selectedStory = selectedStory;

        this.storiesHash = toDataset(
          toNested(stories, {
            rootSeperator,
            groupSeperator,
          })
        );

        const { root, groups = [] } = splitPath(selectedKind, { rootSeperator, groupSeperator });
        const selectedId = []
          .concat(root || [])
          .concat(groups)
          .filter(Boolean)
          .concat(selectedStory)
          .map(toKey)
          .join('-');

        console.log('navigate');
        navigate(`/components/${selectedId}`);
      },

      selectStory(kind, story, { location } = {}) {
        console.log('selectStory!');
        const {
          hierarchyRootSeparator: rootSeperator,
          hierarchySeparator: groupSeperator,
        } = this.uiOptions;
        if (location) {
          const s = this.storiesHash[location.replace('iframe.html?path=/components/', '')];

          if (!s) {
            return;
          }
          const { legacyKind, name } = s;

          const selectedKind = ensureKind(this.stories, legacyKind);
          const selectedStory = ensureStory(this.stories, selectedKind, name);

          this.selectedStory = selectedStory;
          this.selectedKind = selectedKind;
        } else {
          const selectedKind = ensureKind(this.stories, kind);
          const selectedStory = ensureStory(this.stories, selectedKind, story);
          this.selectedStory = selectedStory;
          this.selectedKind = selectedKind;
          const { root, groups = [] } = splitPath(selectedKind, { rootSeperator, groupSeperator });
          const selectedId = []
            .concat(root || [])
            .concat(groups)
            .filter(Boolean)
            .concat(selectedStory)
            .map(toKey)
            .join('-');
          navigate(`/components/${selectedId}`);
        }
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

      // updateFromLocation(params) {
      //   const {
      //     selectedKind,
      //     selectedStory,
      //     addonPanel,
      //     full = 0,
      //     panel = 'bottom',
      //     nav = true,
      //     ...customQueryParams
      //   } = params;

      //   if (selectedKind) {
      //     this.selectedKind = selectedKind;
      //     this.selectedStory = selectedStory;
      //   }

      //   this.setShortcutsOptions({
      //     full: Boolean(Number(full)),
      //     panel: panel === 'bottom' || panel === 'right' ? panel : false,
      //     nav: Boolean(Number(nav)),
      //   });

      //   if (addonPanel) {
      //     this.selectAddonPanel(addonPanel);
      //   }

      //   this.setQueryParams(customQueryParams);
      // },
    },
    {
      setOptions: action,
      setShortcutsOptions: action,
      jumpToStory: action,
      // handleEvent: action,
      toggleSearchBox: action,
      // setStoryFilter: action,
      selectAddonPanel: action,
      setStories: action,
      selectStory: action,
      selectInCurrentKind: action,
      setQueryParams: action,
      // updateFromLocation: action,
    }
  );

  return store;
};

export default createStore;
