import { navigator } from 'global';

export const isMacLike = () =>
  navigator && navigator.platform ? !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) : false;
export const controlOrMetaKey = () => (isMacLike() ? 'meta' : 'control');

export const defaultSerializedShortcuts = Object.freeze({
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

// We serialize the shortcuts in an attempt to save space in local/sessionStorage
function serialize(shortcuts) {
  return Object.entries(shortcuts).reduce(
    (acc, [action, { value }]) => ({ ...acc, [action]: value }),
    []
  );
}

function deserialize(state) {
  return Object.entries(state).reduce(
    (acc, [action, value]) => ({ ...acc, [action]: { value, error: false } }),
    []
  );
}

export default function initShortcuts({ store }) {
  const api = {
    getShortcutKeys() {
      return deserialize(store.getState().shortcuts);
    },
    setShortcut(action, value) {
      store.setState({ shortcuts: serialize({ [action]: value }) }, 'permanent');
    },
    restoreDefaultShortcut(action) {
      // FIXME: we should clear any local storage on this key at this point.
      store.setState({ shortcuts: { [action]: defaultSerializedShortcuts[action] } });
    },
    restoreAllDefaultShortcuts() {
      // FIXME: we should clear any local storage on this key at this point.
      store.setState({ shortcuts: defaultSerializedShortcuts });
    },
  };

  // default initial state is our default set of keyboard shortcuts
  const state = {
    shortcuts: defaultSerializedShortcuts,
  };

  return { api, state };
}
