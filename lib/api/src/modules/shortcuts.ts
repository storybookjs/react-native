import { navigator, document } from 'global';
import { PREVIEW_KEYDOWN } from '@storybook/core-events';

import { Module, API } from '../index';

import { shortcutMatchesShortcut, eventToShortcut } from '../lib/shortcut';
import { focusableUIElements } from './layout';

export const isMacLike = () =>
  navigator && navigator.platform ? !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) : false;
export const controlOrMetaKey = () => (isMacLike() ? 'meta' : 'control');

export function keys<O>(o: O) {
  return Object.keys(o) as (keyof O)[];
}

export interface SubState {
  shortcuts: Shortcuts;
}

export interface SubAPI {
  getShortcutKeys(): Shortcuts;
  setShortcuts(shortcuts: Shortcuts): Promise<Shortcuts>;
  setShortcut(action: Action, value: KeyCollection): Promise<KeyCollection>;
  restoreAllDefaultShortcuts(): Promise<Shortcuts>;
  restoreDefaultShortcut(action: Action): Promise<KeyCollection>;
  handleKeydownEvent(api: API, event: Event): void;
  handleShortcutFeature(api: API, feature: Action): void;
}
export type KeyCollection = string[];

export interface Shortcuts {
  fullScreen: KeyCollection;
  togglePanel: KeyCollection;
  panelPosition: KeyCollection;
  toggleNav: KeyCollection;
  toolbar: KeyCollection;
  search: KeyCollection;
  focusNav: KeyCollection;
  focusIframe: KeyCollection;
  focusPanel: KeyCollection;
  prevComponent: KeyCollection;
  nextComponent: KeyCollection;
  prevStory: KeyCollection;
  nextStory: KeyCollection;
  shortcutsPage: KeyCollection;
  aboutPage: KeyCollection;
  escape: KeyCollection;
}

export type Action = keyof Shortcuts;

export const defaultShortcuts: Shortcuts = Object.freeze({
  fullScreen: ['F'],
  togglePanel: ['A'],
  panelPosition: ['D'],
  toggleNav: ['S'],
  toolbar: ['T'],
  search: ['/'],
  focusNav: ['1'],
  focusIframe: ['2'],
  focusPanel: ['3'],
  prevComponent: ['alt', 'ArrowUp'],
  nextComponent: ['alt', 'ArrowDown'],
  prevStory: ['alt', 'ArrowLeft'],
  nextStory: ['alt', 'ArrowRight'],
  shortcutsPage: [controlOrMetaKey(), 'shift', ','],
  aboutPage: [','],
  escape: ['escape'], // This one is not customizable
});

export interface Event extends KeyboardEvent {
  target: {
    tagName: string;
    addEventListener(): void;
    removeEventListener(): boolean;
    dispatchEvent(event: Event): boolean;
    getAttribute(attr: string): string | null;
  };
}

export default function initShortcuts({ store }: Module) {
  const api: SubAPI = {
    // Getting and setting shortcuts
    getShortcutKeys(): Shortcuts {
      return store.getState().shortcuts;
    },
    async setShortcuts(shortcuts: Shortcuts) {
      await store.setState({ shortcuts }, { persistence: 'permanent' });
      return shortcuts;
    },
    async restoreAllDefaultShortcuts() {
      return api.setShortcuts(defaultShortcuts);
    },
    async setShortcut(action, value) {
      const shortcuts = api.getShortcutKeys();
      await api.setShortcuts({ ...shortcuts, [action]: value });
      return value;
    },
    async restoreDefaultShortcut(action) {
      const defaultShortcut = defaultShortcuts[action];
      return api.setShortcut(action, defaultShortcut);
    },

    // Listening to shortcut events
    handleKeydownEvent(fullApi, event) {
      const shortcut = eventToShortcut(event);
      const shortcuts = api.getShortcutKeys();
      const actions = keys(shortcuts);
      const matchedFeature = actions.find((feature: Action) =>
        shortcutMatchesShortcut(shortcut, shortcuts[feature])
      );
      if (matchedFeature) {
        api.handleShortcutFeature(fullApi, matchedFeature);
      }
    },

    handleShortcutFeature(fullApi, feature) {
      const {
        layout: { isFullscreen, showNav, showPanel },
        ui: { enableShortcuts },
      } = store.getState();
      if (!enableShortcuts) {
        return;
      }
      switch (feature) {
        case 'escape': {
          if (isFullscreen) {
            fullApi.toggleFullscreen();
          } else if (!showNav) {
            fullApi.toggleNav();
          }
          break;
        }

        case 'focusNav': {
          if (isFullscreen) {
            fullApi.toggleFullscreen();
          }
          if (!showNav) {
            fullApi.toggleNav();
          }
          fullApi.focusOnUIElement(focusableUIElements.storyListMenu);
          break;
        }

        case 'search': {
          if (isFullscreen) {
            fullApi.toggleFullscreen();
          }
          if (!showNav) {
            fullApi.toggleNav();
          }

          setTimeout(() => {
            fullApi.focusOnUIElement(focusableUIElements.storySearchField);
          }, 0);
          break;
        }

        case 'focusIframe': {
          const element = document.getElementById('storybook-preview-iframe');

          if (element) {
            try {
              // should be like a channel message and all that, but yolo for now
              element.contentWindow.focus();
            } catch (e) {
              //
            }
          }
          break;
        }

        case 'focusPanel': {
          if (isFullscreen) {
            fullApi.toggleFullscreen();
          }
          if (!showPanel) {
            fullApi.togglePanel();
          }
          fullApi.focusOnUIElement(focusableUIElements.storyPanelRoot);
          break;
        }

        case 'nextStory': {
          fullApi.jumpToStory(1);
          break;
        }

        case 'prevStory': {
          fullApi.jumpToStory(-1);
          break;
        }

        case 'nextComponent': {
          fullApi.jumpToComponent(1);
          break;
        }

        case 'prevComponent': {
          fullApi.jumpToComponent(-1);
          break;
        }

        case 'fullScreen': {
          fullApi.toggleFullscreen();
          break;
        }

        case 'togglePanel': {
          if (isFullscreen) {
            fullApi.toggleFullscreen();
            fullApi.resetLayout();
          }

          fullApi.togglePanel();
          break;
        }

        case 'toggleNav': {
          if (isFullscreen) {
            fullApi.toggleFullscreen();
            fullApi.resetLayout();
          }

          fullApi.toggleNav();
          break;
        }

        case 'toolbar': {
          fullApi.toggleToolbar();
          break;
        }

        case 'panelPosition': {
          if (isFullscreen) {
            fullApi.toggleFullscreen();
          }
          if (!showPanel) {
            fullApi.togglePanel();
          }

          fullApi.togglePanelPosition();
          break;
        }

        case 'aboutPage': {
          fullApi.navigate('/settings/about');
          break;
        }

        case 'shortcutsPage': {
          fullApi.navigate('/settings/shortcuts');
          break;
        }

        default:
          break;
      }
    },
  };

  const { shortcuts: persistedShortcuts = defaultShortcuts }: SubState = store.getState();
  const state: SubState = {
    // Any saved shortcuts that are still in our set of defaults
    shortcuts: keys(defaultShortcuts).reduce(
      (acc, key) => ({ ...acc, [key]: persistedShortcuts[key] || defaultShortcuts[key] }),
      defaultShortcuts
    ),
  };

  const init = ({ api: fullApi }: API) => {
    function focusInInput(event: Event) {
      return (
        /input|textarea/i.test(event.target.tagName) ||
        event.target.getAttribute('contenteditable') !== null
      );
    }
    // Listen for keydown events in the manager
    document.addEventListener('keydown', (event: Event) => {
      if (!focusInInput(event)) {
        fullApi.handleKeydownEvent(fullApi, event);
      }
    });

    // Also listen to keydown events sent over the channel
    fullApi.on(PREVIEW_KEYDOWN, (data: { event: Event }) => {
      fullApi.handleKeydownEvent(fullApi, data.event);
    });
  };
  const result = { api, state, init };

  return result;
}
