import { observable, action, set } from 'mobx';
import pick from 'lodash.pick';
import { themes } from '@storybook/components';
import { types } from '@storybook/addons';
import qs from 'qs';

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
        sidebarAnimations: true,
        theme: themes.normal,
      },
      customQueryParams: {},
      notifications: [
        {
          id: 'update',
          level: 2,
          link: '/settings/about',
          icon: '🎉',
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

      get channel() {
        return provider.channel;
      },

      get panels() {
        return this.getElements(types.PANEL);
      },

      getElements(type) {
        return provider.getElements(type);
      },

      setOptions(changes) {
        const { selectedPanel } = changes;
        const oldOptions = this.uiOptions;
        const options = pick(changes, Object.keys(oldOptions));

        set(oldOptions, options);

        if (selectedPanel && selectedPanel !== this.selectedPanel) {
          this.selectedPanel = ensurePanel(this.panels, selectedPanel, this.selectedPanel);
        }
      },

      setShortcutsOptions(options) {
        set(this.shortcutOptions, pick(options, Object.keys(this.shortcutOptions)));
      },

      jumpToStory(direction) {
        const { storiesHash } = this;
        const { componentRoot, component } = this.urlData;
        let selectedId = component;

        const lookupList = Object.keys(storiesHash).filter(
          k => !(storiesHash[k].children || Array.isArray(storiesHash[k]))
        );

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

        if (componentRoot) {
          history.navigate(`?path=/${componentRoot}/${result}`);
          this.selectedId = result;
        }
      },

      jumpToComponent(direction) {
        const { storiesHash } = this;
        const { componentRoot, component } = this.urlData;
        let selectedId = component;
        const lookupList = Object.keys(storiesHash).filter(
          k =>
            (!storiesHash[k].children || Array.isArray(storiesHash[k])) &&
            (storiesHash[k].kind !== storiesHash[selectedId].kind || k === selectedId)
        );
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

        if (componentRoot) {
          history.navigate(`?path=/${componentRoot}/${result}`);
          this.selectedId = result;
        }
      },

      navigate(path) {
        history.navigate(`?path=${path}`);
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

      get urlData() {
        const { search } = history.location;
        const { path } = qs.parse(search, { ignoreQueryPrefix: true });
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

      selectPanel(panelName) {
        this.selectedPanel = panelName;
      },

      setStories(storiesHash) {
        this.storiesHash = storiesHash;

        const { componentRoot, component } = this.urlData;

        // when there's no selectedId or the selectedId item doesn't exist
        // we try to resolve from state or pick the first leaf and navigate
        if (!component || !storiesHash[component]) {
          // find first leaf
          const selectedId =
            this.selectedId || Object.values(storiesHash).find(s => !s.children).path;

          if (componentRoot) {
            history.navigate(`?path=/${componentRoot}/${selectedId}`);
          }
          this.selectedId = selectedId;
        } else {
          this.selectedId = component;
        }
      },

      selectStory(kind, story, { location } = {}) {
        let selectedId;

        if (location) {
          const { storiesHash } = this;

          const { componentRoot, component } = this.urlData;
          selectedId = component;

          if (!selectedId || !storiesHash[selectedId]) {
            selectedId = this.selectedId || Object.keys(storiesHash)[0];
          }

          if (componentRoot) {
            history.navigate(`?path=/${componentRoot}/${component}`);
          }

          this.selectedId = selectedId;
        } else {
          throw new Error('NOT ALLOWED, must use location!');
        }
      },

      selectInCurrentKind(name) {
        const { componentRoot, component } = this.urlData;
        const selectedId = component.replace(/([^-]+)$/, name);

        if (componentRoot) {
          history.navigate(`?path=/${componentRoot}/${selectedId}`);
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
      navigate: action,
      setShortcutsOptions: action,
      jumpToStory: action,
      selectPanel: action,
      setStories: action,
      selectStory: action,
      selectInCurrentKind: action,
      setQueryParams: action,
    }
  );

  return store;
};

export default createStore;
