import { navigator, window, document } from 'global';
import React from 'react';
import ReactDOM from 'react-dom';
import deprecate from 'util-deprecate';
import AnsiToHtml from 'ansi-to-html';

import addons from '@storybook/addons';
import createChannel from '@storybook/channel-postmessage';
import { ClientApi, StoryStore, ConfigApi } from '@storybook/client-api';
import { toId } from '@storybook/router/utils';
import { logger } from '@storybook/client-logger';
import Events from '@storybook/core-events';

import { initializePath, setPath } from './url';

const ansiConverter = new AnsiToHtml();

const classes = {
  MAIN: 'sb-show-main',
  NOPREVIEW: 'sb-show-nopreview',
  ERROR: 'sb-show-errordisplay',
};

function matches(storyKey, arrayOrRegex) {
  if (Array.isArray(arrayOrRegex)) {
    return arrayOrRegex.includes(storyKey);
  }
  return storyKey.match(arrayOrRegex);
}

export function isExportStory(key, { includeStories, excludeStories }) {
  return (
    (!includeStories || matches(key, includeStories)) &&
    (!excludeStories || !matches(key, excludeStories))
  );
}

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

function showErrorDisplay({ message = '', stack = '' }) {
  document.getElementById('error-message').innerHTML = ansiConverter.toHtml(message);
  document.getElementById('error-stack').innerHTML = ansiConverter.toHtml(stack);

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
  logger.error(exception);
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
    let storyStore;
    let clientApi;
    if (typeof window !== 'undefined' && window.__STORYBOOK_CLIENT_API__) {
      clientApi = window.__STORYBOOK_CLIENT_API__;
      // eslint-disable-next-line no-underscore-dangle
      storyStore = clientApi._storyStore;
    } else {
      storyStore = new StoryStore({ channel });
      clientApi = new ClientApi({ storyStore, decorateStory });
    }
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
  let previousViewMode = '';

  const renderMain = forceRender => {
    const revision = storyStore.getRevision();
    const loadError = storyStore.getError();
    const { storyId, viewMode } = storyStore.getSelection();

    const data = storyStore.fromId(storyId);

    const { kind, name, getDecorated, id, parameters, error } = data || {};

    const renderContext = {
      ...context,
      ...data,
      selectedKind: kind,
      selectedStory: name,
      parameters,
      forceRender,
    };

    if (loadError || error) {
      showErrorDisplay(loadError || error);
      return;
    }

    // Render story only if selectedKind or selectedStory have changed.
    // However, we DO want the story to re-render if the store itself has changed
    // (which happens at the moment when HMR occurs)
    if (
      !forceRender &&
      revision === previousRevision &&
      viewMode === previousViewMode &&
      kind === previousKind &&
      name === previousStory
    ) {
      addons.getChannel().emit(Events.STORY_UNCHANGED, {
        id,
        revision,
        kind,
        name,
        viewMode,
      });
      return;
    }

    if (!forceRender && previousKind && previousStory) {
      addons.getChannel().emit(Events.STORY_CHANGED, id);
    }

    // Docs view renders into a different root ID to avoid conflicts
    // with the user's view layer. Therefore we need to clean up whenever
    // we transition between view modes
    if (viewMode !== previousViewMode) {
      switch (viewMode) {
        case 'docs': {
          document.getElementById('root').setAttribute('hidden', true);
          document.getElementById('docs-root').removeAttribute('hidden');
          break;
        }
        case 'story':
        default: {
          if (previousViewMode === 'docs') {
            document.getElementById('docs-root').setAttribute('hidden', true);
            ReactDOM.unmountComponentAtNode(document.getElementById('docs-root'));
            document.getElementById('root').removeAttribute('hidden');
          }
        }
      }
    }
    // Given a cleaned up state, render the appropriate view mode
    switch (viewMode) {
      case 'docs': {
        const NoDocs = () => <div style={{ fontFamily: 'sans-serif' }}>No docs found</div>;
        const StoryDocs = (parameters && parameters.docs) || NoDocs;
        ReactDOM.render(
          <StoryDocs context={renderContext} />,
          document.getElementById('docs-root')
        );
        break;
      }
      case 'story':
      default: {
        if (getDecorated) {
          render(renderContext);
          addons.getChannel().emit(Events.STORY_RENDERED, id);
        } else {
          showNopreview();
          addons.getChannel().emit(Events.STORY_MISSING, id);
        }
        break;
      }
    }

    previousRevision = revision;
    previousKind = kind;
    previousStory = name;
    previousViewMode = viewMode;

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
    channel.on(Events.SET_CURRENT_STORY, ({ storyId: inputStoryId, name, kind, viewMode }) => {
      let storyId = inputStoryId;
      // For backwards compatibility
      if (!storyId) {
        if (!name || !kind) {
          throw new Error('You should pass `storyId` into SET_CURRENT_STORY');
        }
        storyId = deprecatedToId(kind, name);
      }

      storyStore.setSelection({ storyId, viewMode });
      setPath({ storyId, viewMode });
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

  storyStore.on(Events.STORY_INIT, () => {
    const { storyId, viewMode } = initializePath();
    storyStore.setSelection({ storyId, viewMode });
  });

  storyStore.on(Events.STORY_RENDER, renderUI);

  if (typeof window !== 'undefined') {
    window.__STORYBOOK_CLIENT_API__ = clientApi;
    window.__STORYBOOK_STORY_STORE__ = storyStore;
    window.__STORYBOOK_ADDONS_CHANNEL__ = channel; // may not be defined
  }

  let previousExports = {};
  const loadStories = (req, framework) => () => {
    req.keys().forEach(filename => {
      const fileExports = req(filename);

      // An old-style story file
      if (!fileExports.default) {
        return;
      }

      if (!fileExports.default.title) {
        throw new Error(
          `Unexpected default export without title in '${filename}': ${JSON.stringify(
            fileExports.default
          )}`
        );
      }

      const { default: meta, ...exports } = fileExports;
      const kindName = meta.title;

      if (previousExports[filename]) {
        if (previousExports[filename] === fileExports) {
          return;
        }

        // Otherwise clear this kind
        storyStore.removeStoryKind(kindName);
        storyStore.incrementRevision();
      }

      // We pass true here to avoid the warning about HMR. It's cool clientApi, we got this
      const kind = clientApi.storiesOf(kindName, true);
      kind.addParameters({ framework });

      (meta.decorators || []).forEach(decorator => {
        kind.addDecorator(decorator);
      });
      if (meta.parameters) {
        kind.addParameters(meta.parameters);
      }

      Object.keys(exports).forEach(key => {
        if (isExportStory(key, meta)) {
          const storyFn = exports[key];
          const { name, parameters, decorators } = storyFn.story || {};
          if (parameters && parameters.decorators) {
            deprecate(() => {},
            `${kindName} => ${name || key}: story.parameters.decorators is deprecated; use story.decorators instead.`)();
          }
          const decoratorParams = decorators ? { decorators } : null;
          kind.add(name || key, storyFn, { ...parameters, ...decoratorParams });
        }
      });

      previousExports[filename] = fileExports;
    });
  };

  const load = (req, m, framework) => {
    if (m && m.hot && m.hot.dispose) {
      ({ previousExports = {} } = m.hot.data || {});

      m.hot.dispose(data => {
        // eslint-disable-next-line no-param-reassign
        data.previousExports = previousExports;
      });
    }
    configApi.configure(loadStories(req, framework), m);
  };

  return { load, context, clientApi, configApi, forceReRender };
}
