import addons from '@storybook/addons';
import { navigator, window, document } from 'global';
import createChannel from '@storybook/channel-postmessage';
import { ClientApi, StoryStore, ConfigApi } from '@storybook/client-api';
import { toId } from '@storybook/router/utils';
import { logger } from '@storybook/client-logger';
import Events from '@storybook/core-events';
import deprecate from 'util-deprecate';

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

function focusInInput(event) {
  return (
    /input|textarea/i.test(event.target.tagName) ||
    event.target.getAttribute('contenteditable') !== null
  );
}

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
    const selection = storyStore.getSelection();
    const { kind, name, getDecorated, id } = selection || {};

    if (getDecorated) {
      // Render story only if selectedKind or selectedStory have changed.
      // However, we DO want the story to re-render if the store itself has changed
      // (which happens at the moment when HMR occurs)
      if (
        !forceRender &&
        revision === previousRevision &&
        kind === previousKind &&
        previousStory === name
      ) {
        addons.getChannel().emit(Events.STORY_UNCHANGED, id);
        return;
      }

      if (!forceRender && previousKind && previousStory) {
        addons.getChannel().emit(Events.STORY_CHANGED, id);
      }

      render({
        ...context,
        ...selection,
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

    if (!forceRender) {
      document.documentElement.scrollTop = 0;
    }
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
    const deprecatedToId = deprecate(
      toId,
      `Passing name+kind to the SET_CURRENT_STORY event is deprecated, use a storyId instead`
    );

    channel.on(Events.FORCE_RE_RENDER, forceReRender);
    channel.on(Events.SET_CURRENT_STORY, ({ storyId: inputStoryId, name, kind }) => {
      let storyId = inputStoryId;
      // For backwards compatibility
      if (!storyId) {
        if (!name || !kind) {
          throw new Error('You should pass `storyId` into SET_CURRENT_STORY');
        }
        storyId = deprecatedToId(kind, name);
      }

      const data = storyStore.fromId(storyId);

      storyStore.setSelection(data);
      storyStore.setPath(storyId);
    });

    // Handle keyboard shortcuts
    window.onkeydown = event => {
      if (!focusInInput(event)) {
        // We have to pick off the keys of the event that we need on the other side
        const { altKey, ctrlKey, metaKey, shiftKey, key, code, keyCode } = event;
        channel.emit(Events.PREVIEW_KEYDOWN, {
          event: { altKey, ctrlKey, metaKey, shiftKey, key, code, keyCode },
        });
      }
    };
  }

  storyStore.on(Events.STORY_RENDER, renderUI);

  if (typeof window !== 'undefined') {
    window.__STORYBOOK_CLIENT_API__ = clientApi;
    window.__STORYBOOK_ADDONS_CHANNEL__ = channel; // may not be defined
  }

  return { context, clientApi, configApi, forceReRender };
}
