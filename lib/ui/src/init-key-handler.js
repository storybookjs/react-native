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
        if (uiStore.isFullscreen) {
          uiStore.toggleFullscreen();
        }
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
        if (uiStore.isFullscreen) {
          uiStore.toggleFullscreen();
        }
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
          try {
            // should be like a channel message and all that, but yolo for now
            element.contentWindow.focus();
          } catch (e) {
            //
          }
        }
        break;
      }

      case features.FOCUS_PANEL: {
        if (uiStore.isFullscreen) {
          uiStore.toggleFullscreen();
        }
        if (!uiStore.showPanel) {
          uiStore.togglePanel();
        }
        const element = document.getElementById('storybook-panel-root');

        if (element) {
          element.focus();
        }
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

      case features.NEXT_COMPONENT: {
        store.jumpToComponent(1);
        break;
      }

      case features.PREV_COMPONENT: {
        store.jumpToComponent(-1);
        break;
      }

      case features.FULLSCREEN: {
        uiStore.toggleFullscreen();
        break;
      }

      case features.PANEL_VISIBILITY: {
        if (uiStore.isFullscreen) {
          uiStore.toggleFullscreen();
        }

        uiStore.togglePanel();
        break;
      }

      case features.NAV_VISIBILITY: {
        if (uiStore.isFullscreen) {
          uiStore.toggleFullscreen();
        }

        uiStore.toggleNav();
        break;
      }

      case features.PANEL_POSITION: {
        if (uiStore.isFullscreen) {
          uiStore.toggleFullscreen();
        }
        if (!uiStore.showPanel) {
          uiStore.togglePanel();
        }

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
