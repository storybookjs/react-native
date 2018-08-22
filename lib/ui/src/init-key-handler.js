import { document } from 'global';
import keyEvents, { features } from './libs/key_events';

export default ({ store, uiStore }) => {
  const handle = eventType => {
    switch (eventType) {
      case features.NEXT_STORY: {
        store.jumpToStory(1);
        break;
      }

      case features.PREV_STORY: {
        store.jumpToStory(-1);
        break;
      }

      case features.FULLSCREEN: {
        uiStore.toggleFullscreen();
        break;
      }

      case features.ADDON_PANEL: {
        uiStore.togglePanel();
        break;
      }

      case features.STORIES_PANEL: {
        uiStore.toggleNav();
        break;
      }

      case features.SHOW_SEARCH: {
        store.toggleSearchBox();
        break;
      }

      case features.ADDON_PANEL_IN_RIGHT: {
        uiStore.togglePanelPosition();
        break;
      }

      default:
        break;
    }
  };

  return {
    handle,
    bind() {
      document.addEventListener('keydown', e => handle(keyEvents(e)));
    },
  };
};
