import { document } from 'global';
import keyEvents, { features } from './libs/key_events';

export default ({ store, uiStore }) => {
  const handle = eventType => {
    switch (eventType) {
      case features.ESCAPE: {
        if (uiStore.isFullscreen) {
          uiStore.toggleFullscreen();
        } else if (!uiStore.showNav) {
          uiStore.toggleNav();
        }
        document.activeElement.blur();
        break;
      }

      case features.FOCUS_NAV: {
        if (!uiStore.showNav) {
          uiStore.toggleNav();
        }
        const element = document.getElementById('storybook-explorer-menu');

        if (element) {
          element.focus();
        }
        break;
      }

      case features.FOCUS_SEARCH: {
        if (!uiStore.showNav) {
          uiStore.toggleNav();
        }
        const element = document.getElementById('storybook-explorer-searchfield');

        if (element) {
          element.focus();
        }
        break;
      }

      case features.FOCUS_IFRAME: {
        const element = document.getElementById('storybook-preview-iframe');

        if (element) {
          element.focus();
        }
        document.activeElement.blur();
        break;
      }

      case features.FOCUS_PANEL: {
        const element = document.getElementById('storybook-panel-root');

        if (element) {
          element.focus();
        }
        document.activeElement.blur();
        break;
      }

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

      case features.PANEL_VISIBILITY: {
        uiStore.togglePanel();
        break;
      }

      case features.NAV_VISIBILITY: {
        uiStore.toggleNav();
        break;
      }

      case features.PANEL_POSITION: {
        uiStore.togglePanelPosition();
        break;
      }

      case features.ABOUT: {
        store.navigate('/settinga/about');
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
