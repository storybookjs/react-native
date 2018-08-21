import { createStore } from 'redux';
import addons from '@storybook/addons';
import { navigator, window, document } from 'global';
import createChannel from '@storybook/channel-postmessage';
import { handleKeyboardShortcuts } from '@storybook/ui/dist/libs/key_events';
import { logger } from '@storybook/client-logger';
import Events from '@storybook/core-events';

import StoryStore from './story_store';
import ClientApi from './client_api';
import ConfigApi from './config_api';
import reducer from './reducer';
import * as Actions from './actions';
import syncUrlWithStore from './syncUrlWithStore';

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

export default function start(render, { decorateStory } = {}) {
  // check whether we're running on node/browser
  const isBrowser =
    navigator &&
    navigator.userAgent &&
    navigator.userAgent !== 'storyshots' &&
    !(navigator.userAgent.indexOf('Node.js') > -1) &&
    !(navigator.userAgent.indexOf('jsdom') > -1);

  const storyStore = new StoryStore();
  const reduxStore = createStore(reducer);
  const context = {
    storyStore,
    reduxStore,
    decorateStory,
    showMain,
    showError,
    showException,
  };

  const clientApi = new ClientApi(context);

  let channel;
  if (isBrowser) {
    // setup preview channel
    channel = createChannel({ page: 'preview' });
    channel.on(Events.SET_CURRENT_STORY, data => {
      reduxStore.dispatch(Actions.selectStory(data.kind, data.story));
    });
    addons.setChannel(channel);
    Object.assign(context, { channel });

    syncUrlWithStore(reduxStore);

    // Handle keyboard shortcuts
    window.onkeydown = handleKeyboardShortcuts(channel);
  }

  // Provide access to external scripts if `window` is defined.
  // NOTE this is different to isBrowser, primarily for the JSDOM use case
  if (typeof window !== 'undefined') {
    window.__STORYBOOK_CLIENT_API__ = clientApi;
    window.__STORYBOOK_ADDONS_CHANNEL__ = channel; // may not be defined
  }

  const { clearDecorators } = clientApi;
  const configApi = new ConfigApi({ clearDecorators, ...context });

  let previousKind = '';
  let previousStory = '';
  let previousRevision = -1;

  const renderMain = forceRender => {
    if (storyStore.size() === 0) {
      showNopreview();
      return;
    }

    const { selectedKind, selectedStory } = reduxStore.getState();

    const revision = storyStore.getRevision();
    const story = storyStore.getStoryWithContext(selectedKind, selectedStory);
    if (!story) {
      showNopreview();
      return;
    }

    // Render story only if selectedKind or selectedStory has changed.
    // renderMain() gets executed after each action. Actions will cause the whole
    // story to re-render without this check.
    //    https://github.com/storybooks/react-storybook/issues/116
    // However, we do want the story to re-render if the store itself has changed
    // (which happens at the moment when HMR occurs)
    if (
      !forceRender &&
      revision === previousRevision &&
      selectedKind === previousKind &&
      previousStory === selectedStory
    ) {
      return;
    }

    if (!forceRender) {
      // Scroll to top of the page when changing story
      document.documentElement.scrollTop = 0;
    }
    previousRevision = revision;
    previousKind = selectedKind;
    previousStory = selectedStory;

    render({
      ...context,
      story,
      selectedKind,
      selectedStory,
      forceRender,
    });
  };

  // initialize the UI
  const renderUI = forceRender => {
    if (isBrowser) {
      const { error } = reduxStore.getState();
      if (error) {
        showException(error);
        return;
      }
      try {
        renderMain(forceRender);
        addons.getChannel().emit(Events.STORY_RENDERED);
      } catch (ex) {
        showException(ex);
      }
    }
  };

  const forceReRender = () => renderUI(true);
  if (isBrowser) {
    channel.on(Events.FORCE_RE_RENDER, forceReRender);
  }
  renderUI();
  reduxStore.subscribe(renderUI);

  return { context, clientApi, configApi, forceReRender };
}
