import { document } from 'global';
import keyEvents, { features } from './libs/key_events';

export default ({ manager }) => {
  const handle = eventType => {
    const {
      ui: { isFullscreen, showNav, showPanel },
    } = manager.store.getState();

    switch (eventType) {
      case features.ESCAPE: {
        if (isFullscreen) {
          manager.toggleFullscreen();
        } else if (!showNav) {
          manager.toggleNav();
        }
        document.activeElement.blur();
        break;
      }

      case features.FOCUS_NAV: {
        if (isFullscreen) {
          manager.toggleFullscreen();
        }
        if (!showNav) {
          manager.toggleNav();
        }
        const element = document.getElementById('storybook-explorer-menu');

        if (element) {
          element.focus();
        }
        break;
      }

      case features.FOCUS_SEARCH: {
        if (isFullscreen) {
          manager.toggleFullscreen();
        }
        if (!showNav) {
          manager.toggleNav();
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
        if (isFullscreen) {
          manager.toggleFullscreen();
        }
        if (!showPanel) {
          manager.togglePanel();
        }
        const element = document.getElementById('storybook-panel-root');

        if (element) {
          element.focus();
        }
        break;
      }

      case features.NEXT_STORY: {
        manager.jumpToStory(1);
        break;
      }

      case features.PREV_STORY: {
        manager.jumpToStory(-1);
        break;
      }

      case features.NEXT_COMPONENT: {
        manager.jumpToComponent(1);
        break;
      }

      case features.PREV_COMPONENT: {
        manager.jumpToComponent(-1);
        break;
      }

      case features.FULLSCREEN: {
        manager.toggleFullscreen();
        break;
      }

      case features.PANEL_VISIBILITY: {
        if (isFullscreen) {
          manager.toggleFullscreen();
        }

        manager.togglePanel();
        break;
      }

      case features.NAV_VISIBILITY: {
        if (isFullscreen) {
          manager.toggleFullscreen();
        }

        manager.toggleNav();
        break;
      }

      case features.TOOL_VISIBILITY: {
        manager.toggleToolbar();
        break;
      }

      case features.PANEL_POSITION: {
        if (isFullscreen) {
          manager.toggleFullscreen();
        }
        if (!showPanel) {
          manager.togglePanel();
        }

        manager.togglePanelPosition();
        break;
      }

      case features.ABOUT: {
        manager.navigate('/settings/about');
        break;
      }

      case features.SHORTCUTS: {
        manager.navigate('/settings/shortcuts');
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
