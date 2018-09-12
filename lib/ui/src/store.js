import { observable, action, set } from 'mobx';
import pick from 'lodash.pick';
import { themes } from '@storybook/components';
import qs from 'qs';
import { toDataset, toNested, splitPath, toKey } from './libs/nav/nav';

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

const regexEqual = (a, b) => a === b || a.toString() === b.toString();

const createStore = ({ provider, history }) => {
  const store = observable(
    {
      stories: [],
      storiesHash: {},
      selectedId: null,
      shortcutOptions: {
        full: false,
        nav: true,
        panel: 'right',
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

      setOptions(changes) {
        const { selectedPanel, hierarchyRootSeparator, hierarchySeparator } = changes;
        const oldOptions = this.uiOptions;
        const {
          selectedPanel: oldSelectedPanel,
          hierarchyRootSeparator: oldHierarchyRootSeparator,
          hierarchySeparator: oldHierarchySeparator,
        } = this.uiOptions;
        const options = pick(changes, Object.keys(oldOptions));

        set(oldOptions, options);

        if (selectedPanel !== oldSelectedPanel) {
          set(this.selectedPanel, ensurePanel(this.panels, selectedPanel, this.selectedPanel));
        }
        if (
          !(
            regexEqual(hierarchyRootSeparator, oldHierarchyRootSeparator) ||
            regexEqual(hierarchySeparator, oldHierarchySeparator)
          )
        ) {
          console.warn('Stories were re-calculated because of option changes');
          this.setStories(this.stories);
        }
      },

      setShortcutsOptions(options) {
        set(this.shortcutOptions, pick(options, Object.keys(this.shortcutOptions)));
      },

      jumpToStory(direction) {
        const { storiesHash } = this;
        const lookupList = Object.keys(storiesHash).filter(
          k => !(storiesHash[k].children || Array.isArray(storiesHash[k]))
        );

        const { search } = history.location;
        const { path } = qs.parse(search, { ignoreQueryPrefix: true });
        let selectedId = path.split('/components/')[1];

        if (!selectedId || !storiesHash[selectedId]) {
          selectedId = this.selectedId || Object.keys(storiesHash)[0];
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

        history.navigate(`?path=/components/${result}`);
        this.selectedId = result;
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

      get componentsUrl() {
        const { storiesHash } = this;
        const { search } = history.location;
        const { path } = qs.parse(search, { ignoreQueryPrefix: true });
        let selectedId = path.split('/components/')[1];

        if (!selectedId || !storiesHash[selectedId]) {
          // skip root
          selectedId = this.selectedId || Object.keys(storiesHash)[1];
        }
        if (selectedId) {
          return `/components/${selectedId}`;
        }
        return '/components';
      },

      toggleSearchBox() {},

      selectAddonPanel(panelName) {
        this.selectedPanel = panelName;
      },

      setStories(stories) {
        console.log('setStories');

        const {
          hierarchyRootSeparator: rootSeperator,
          hierarchySeparator: groupSeperator,
        } = this.uiOptions;

        const storiesHash = toDataset(
          toNested(stories, {
            rootSeperator,
            groupSeperator,
          })
        );

        this.stories = stories;
        this.storiesHash = storiesHash;

        const { search } = history.location;
        const { path } = qs.parse(search, { ignoreQueryPrefix: true });
        let selectedId = path.split('/components/')[1];

        // when there's no selectedId or the selectedId item doesn't exist/
        // we try to resolve from state or pick the first and navigate
        if (!selectedId || !storiesHash[selectedId]) {
          // skip root
          selectedId = this.selectedId || Object.keys(storiesHash)[1];

          if (path.match(/^\/components/)) {
            history.navigate(`?path=/components/${selectedId}`);
          }
        }

        this.selectedId = selectedId;
      },

      selectStory(kind, story, { location } = {}) {
        let selectedId;
        const {
          hierarchyRootSeparator: rootSeperator,
          hierarchySeparator: groupSeperator,
        } = this.uiOptions;
        if (location) {
          const { storiesHash } = this;

          const { search } = history.location;
          const { path } = qs.parse(search, { ignoreQueryPrefix: true });
          [, selectedId] = path.split('/components/');

          if (!selectedId || !storiesHash[selectedId]) {
            // skip root
            selectedId = this.selectedId || Object.keys(storiesHash)[1];
          }
        } else {
          const { root, groups = [] } = splitPath(kind, { rootSeperator, groupSeperator });
          selectedId = []
            .concat(root || [])
            .concat(groups)
            .filter(Boolean)
            .concat(story)
            .map(toKey)
            .join('-');
        }

        const { search } = history.location;
        const { path } = qs.parse(search, { ignoreQueryPrefix: true });

        if (path.match(/^\/components/)) {
          history.navigate(`?path=/components/${selectedId}`);
        }
        this.selectedId = selectedId;
      },

      selectInCurrentKind(name) {
        const selectedId = this.selectedId.replace(/([^-]+)$/, name);

        const { search } = history.location;
        const { path } = qs.parse(search, { ignoreQueryPrefix: true });

        if (path.match(/^\/components/)) {
          history.navigate(`?path=/components/${selectedId}`);
        }
        this.selectedId = selectedId;
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
    },
    {
      setOptions: action,
      setShortcutsOptions: action,
      jumpToStory: action,
      toggleSearchBox: action,
      selectAddonPanel: action,
      setStories: action,
      selectStory: action,
      selectInCurrentKind: action,
      setQueryParams: action,
    }
  );

  return store;
};

export default createStore;
