import { navigator } from 'global';

export const isMacLike = () =>
  navigator && navigator.platform ? !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) : false;
export const controlOrMetaKey = () => (isMacLike() ? 'meta' : 'control');

export const defaultShortcuts = Object.freeze({
  fullScreen: ['F'],
  togglePanel: ['S'], // Panel visibiliy
  panelPosition: ['D'],
  navigation: ['A'],
  toolbar: ['T'],
  search: ['/'],
  focusNav: ['1'],
  focusIframe: ['2'],
  focusPanel: ['3'],
  prevComponent: ['alt', 'ArrowUp'],
  nextComponent: ['alt', 'ArrowDown'],
  prevStory: ['alt', 'ArrowLeft'],
  nextStory: ['alt', 'ArrowRight'],
  shortcutsPage: ['shift', ',', controlOrMetaKey()],
  aboutPage: [','],
});

export default function initShortcuts({ store }) {
  const api = {
    getShortcutKeys() {
      return store.getState().shortcuts;
    },
    setShortcut(action, value) {
      store.setState({ shortcuts: { [action]: value } }, 'permanent');
    },
    restoreDefaultShortcut(action) {
      const defaultShortcut = defaultShortcuts[action];
      // FIXME: we should clear any local storage on this key at this point.
      store.setState({ shortcuts: { [action]: defaultShortcut } });
      return defaultShortcut;
    },
    restoreAllDefaultShortcuts() {
      // FIXME: we should clear any local storage on this key at this point.
      store.setState({ shortcuts: defaultShortcuts });
      return defaultShortcuts;
    },
  };

  // default initial state is our default set of keyboard shortcuts
  const state = {
    shortcuts: defaultShortcuts,
  };

  return { api, state };
}
