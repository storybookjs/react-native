import { document } from 'global';
import keyEvents, { features } from '../libs/key_events';

export default ({ store, api }) => {
  const handle = eventType => {
    const {
      ui: { isFullscreen, showNav, showPanel },
    } = store.getState();

    switch (eventType) {
      case features.ESCAPE: {
        if (isFullscreen) {
          api.toggleFullscreen();
        } else if (!showNav) {
          api.toggleNav();
        }
        document.activeElement.blur();
        break;
      }

      case features.FOCUS_NAV: {
        if (isFullscreen) {
          api.toggleFullscreen();
        }
        if (!showNav) {
          api.toggleNav();
        }
        const element = document.getElementById('storybook-explorer-menu');

        if (element) {
          element.focus();
        }
        break;
      }

      case features.FOCUS_SEARCH: {
        if (isFullscreen) {
          api.toggleFullscreen();
        }
        if (!showNav) {
          api.toggleNav();
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
          api.toggleFullscreen();
        }
        if (!showPanel) {
          api.togglePanel();
        }
        const element = document.getElementById('storybook-panel-root');

        if (element) {
          element.focus();
        }
        break;
      }

      case features.NEXT_STORY: {
        api.jumpToStory(1);
        break;
      }

      case features.PREV_STORY: {
        api.jumpToStory(-1);
        break;
      }

      case features.NEXT_COMPONENT: {
        api.jumpToComponent(1);
        break;
      }

      case features.PREV_COMPONENT: {
        api.jumpToComponent(-1);
        break;
      }

      case features.FULLSCREEN: {
        api.toggleFullscreen();
        break;
      }

      case features.PANEL_VISIBILITY: {
        if (isFullscreen) {
          api.toggleFullscreen();
        }

        api.togglePanel();
        break;
      }

      case features.NAV_VISIBILITY: {
        if (isFullscreen) {
          api.toggleFullscreen();
        }

        api.toggleNav();
        break;
      }

      case features.TOOL_VISIBILITY: {
        api.toggleToolbar();
        break;
      }

      case features.PANEL_POSITION: {
        if (isFullscreen) {
          api.toggleFullscreen();
        }
        if (!showPanel) {
          api.togglePanel();
        }

        api.togglePanelPosition();
        break;
      }

      case features.ABOUT: {
        api.navigate('/settings/about');
        break;
      }

      case features.SHORTCUTS: {
        api.navigate('/settings/shortcuts');
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
