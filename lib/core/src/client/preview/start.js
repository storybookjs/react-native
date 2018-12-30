import addons from '@storybook/addons';
import { navigator, window, document } from 'global';
import createChannel from '@storybook/channel-postmessage';
import { handleKeyboardShortcuts } from '@storybook/ui/dist/libs/key_events';
import { logger } from '@storybook/client-logger';
import Events from '@storybook/core-events';

import StoryStore from './story_store';
import ClientApi from './client_api';
import ConfigApi from './config_api';

const classes = {
  MAIN: 'sb-show-main',
  NOPREVIEW: 'sb-show-nopreview',
  ERROR: 'sb-show-errordisplay',
};

function showMain() {
  document.body.classList.remove(classes.NOPREVIEW);
  document.body.classList.remove(classes.ERROR);

  document.body.classList.add(classes.MAIN);
}

function showNopreview() {
  document.body.classList.remove(classes.MAIN);
  document.body.classList.remove(classes.ERROR);

  document.body.classList.add(classes.NOPREVIEW);
}

function showErrorDisplay({ message, stack }) {
  document.getElementById('error-message').textContent = message;
  document.getElementById('error-stack').textContent = stack;

  document.body.classList.remove(classes.MAIN);
  document.body.classList.remove(classes.NOPREVIEW);
  document.body.classList.add(classes.ERROR);
}

// showError is used by the various app layers to inform the user they have done something
// wrong -- for instance returned the wrong thing from a story
function showError({ title, description }) {
  addons.getChannel().emit(Events.STORY_ERRORED, { title, description });
  showErrorDisplay({
    message: title,
    stack: description,
  });
}

// showException is used if we fail to render the story and it is uncaught by the app layer
function showException(exception) {
  addons.getChannel().emit(Events.STORY_THREW_EXCEPTION, exception);
  showErrorDisplay(exception);

  // Log the stack to the console. So, user could check the source code.
  logger.error(exception.stack);
}

const isBrowser =
  navigator &&
  navigator.userAgent &&
  navigator.userAgent !== 'storyshots' &&
  !(navigator.userAgent.indexOf('Node.js') > -1) &&
  !(navigator.userAgent.indexOf('jsdom') > -1);

export const getContext = (() => {
  let cache;
  return decorateStory => {
    if (cache) {
      return cache;
    }
    let channel = null;
    if (isBrowser) {
      try {
        channel = addons.getChannel();
      } catch (e) {
        channel = createChannel({ page: 'preview' });
        addons.setChannel(channel);
      }
    } else {
      channel = createChannel({ page: 'preview' });
    }

    const storyStore = new StoryStore({ channel });
    const clientApi = new ClientApi({ storyStore, decorateStory });
    const { clearDecorators } = clientApi;
    const configApi = new ConfigApi({ clearDecorators, storyStore, channel, clientApi });

    return {
      configApi,
      storyStore,
      channel,
      clientApi,
      showMain,
      showError,
      showException,
    };
  };
})();

export default function start(render, { decorateStory } = {}) {
  const context = getContext(decorateStory);

  const { clientApi, channel, configApi, storyStore } = context;
  // Provide access to external scripts if `window` is defined.
  // NOTE this is different to isBrowser, primarily for the JSDOM use case
  let previousKind = '';
  let previousStory = '';
  let previousRevision = -1;

  const renderMain = forceRender => {
    const revision = storyStore.getRevision();
    const { kind, name, story, id } = storyStore.getSelection() || {};

    if (story) {
      // Render story only if selectedKind or selectedStory have changed.
      // However, we DO want the story to re-render if the store itself has changed
      // (which happens at the moment when HMR occurs)
      if (
        !forceRender &&
        revision === previousRevision &&
        kind === previousKind &&
        previousStory === name
      ) {
        return;
      }

      if (!forceRender) {
        // Scroll to top of the page when changing story
        document.documentElement.scrollTop = 0;
      }

      if (!forceRender && previousKind && previousStory) {
        addons.getChannel().emit(Events.STORY_CHANGED, id);
      }

      render({
        ...context,
        story,
        selectedKind: kind,
        selectedStory: name,
        forceRender,
      });
      addons.getChannel().emit(Events.STORY_RENDERED, id);
    } else {
      showNopreview();
      addons.getChannel().emit(Events.STORY_MISSING, id);
    }
    previousRevision = revision;
    previousKind = kind;
    previousStory = name;
  };

  // initialize the UI
  const renderUI = forceRender => {
    if (isBrowser) {
      try {
        renderMain(forceRender);
      } catch (ex) {
        showException(ex);
      }
    }
  };

  const forceReRender = () => renderUI(true);

  // channel can be null in NodeJS
  if (isBrowser) {
    channel.on(Events.FORCE_RE_RENDER, forceReRender);
    channel.on(Events.SET_CURRENT_STORY, ({ storyId }) => {
      if (!storyId) {
        throw new Error('should have storyId');
      }
      const data = storyStore.fromId(storyId);

      storyStore.setSelection(data);
      storyStore.setPath(storyId);
    });

    // Handle keyboard shortcuts
    window.onkeydown = handleKeyboardShortcuts(channel);
  }

  storyStore.on(Events.STORY_RENDER, renderUI);

  if (typeof window !== 'undefined') {
    window.__STORYBOOK_CLIENT_API__ = clientApi;
    window.__STORYBOOK_ADDONS_CHANNEL__ = channel; // may not be defined
  }

  return { context, clientApi, configApi, forceReRender };
}
