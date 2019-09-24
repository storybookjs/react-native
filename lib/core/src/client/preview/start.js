import { navigator, window, document } from 'global';
import React from 'react';
import ReactDOM from 'react-dom';
import deprecate from 'util-deprecate';
import AnsiToHtml from 'ansi-to-html';

import addons from '@storybook/addons';
import createChannel from '@storybook/channel-postmessage';
import { ClientApi, StoryStore, ConfigApi } from '@storybook/client-api';
import { toId, storyNameFromExport } from '@storybook/router/utils';
import { logger } from '@storybook/client-logger';
import Events from '@storybook/core-events';

import { initializePath, setPath } from './url';
import { NoDocs } from './NoDocs';

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
  let previousId = null;

  const renderMain = forceRender => {
    const revision = storyStore.getRevision();
    const loadError = storyStore.getError();
    const { storyId, viewMode: urlViewMode } = storyStore.getSelection();

    const data = storyStore.fromId(storyId);

    const { kind, name, getDecorated, id, parameters, error } = data || {};

    const viewMode = parameters && parameters.docsOnly ? 'docs' : urlViewMode;

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

    switch (previousViewMode) {
      case 'docs':
        if (previousKind != null && (kind !== previousKind || viewMode !== previousViewMode)) {
          storyStore.cleanHooksForKind(previousKind);
        }
        break;
      case 'story':
      default:
        if (previousId != null && (id !== previousId || viewMode !== previousViewMode)) {
          storyStore.cleanHooks(previousId);
        }
    }

    // Docs view renders into a different root ID to avoid conflicts
    // with the user's view layer. Therefore we need to clean up whenever
    // we transition between view modes
    if (viewMode !== previousViewMode) {
      switch (viewMode) {
        case 'docs': {
          showMain();
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
        const docs = (parameters && parameters.docs) || {};
        // eslint-disable-next-line react/prop-types
        const DocsContainer = docs.container || (({ children }) => <>{children}</>);
        const Page = docs.page || NoDocs;
        ReactDOM.render(
          <DocsContainer context={renderContext}>
            <Page />
          </DocsContainer>,
          document.getElementById('docs-root'),
          () => addons.getChannel().emit(Events.DOCS_RENDERED, kind)
        );
        break;
      }
      case 'story':
      default: {
        if (getDecorated) {
          (async () => {
            try {
              await render(renderContext);
              addons.getChannel().emit(Events.STORY_RENDERED, id);
            } catch (ex) {
              showException(ex);
            }
          })();
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
    previousId = id;

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

  let previousExports = new Set();
  const loadStories = (loadable, framework) => () => {
    // Make sure we don't try to define a kind more than once within the same load
    const loadedKinds = new Set();

    let reqs = null;
    if (Array.isArray(loadable)) {
      reqs = loadable;
    } else if (loadable.keys) {
      reqs = [loadable];
    }

    let currentExports = new Set();
    if (reqs) {
      reqs.forEach(req => {
        req.keys().forEach(filename => {
          const fileExports = req(filename);
          currentExports.add(fileExports);
        });
      });
    } else {
      const exported = loadable();
      if (Array.isArray(exported) && !exported.find(obj => !obj.default)) {
        currentExports = new Set(exported);
      } else if (exported) {
        logger.warn(
          `Loader function passed to 'configure' should return void or an array of module exports that all contain a 'default' export. Received: ${JSON.stringify(
            exported
          )}`
        );
      }
    }

    const removed = [...previousExports].filter(exp => !currentExports.has(exp));
    removed.forEach(exp => {
      if (exp.default) {
        storyStore.removeStoryKind(exp.default.title);
      }
    });
    if (removed.length > 0) {
      storyStore.incrementRevision();
    }

    const added = [...currentExports].filter(exp => !previousExports.has(exp));
    added.forEach(fileExports => {
      // An old-style story file
      if (!fileExports.default) {
        return;
      }

      if (!fileExports.default.title) {
        throw new Error(
          `Unexpected default export without title: ${JSON.stringify(fileExports.default)}`
        );
      }

      const { default: meta, ...exports } = fileExports;
      const { title: kindName, parameters: params, decorators: decos, component } = meta;

      if (loadedKinds.has(kindName)) {
        throw new Error(
          `Duplicate title '${kindName}' used in multiple files; use unique titles or combine '${kindName}' stories into a single file.`
        );
      }
      loadedKinds.add(kindName);

      // We pass true here to avoid the warning about HMR. It's cool clientApi, we got this
      const kind = clientApi.storiesOf(kindName, true);

      // we should always have a framework, rest optional
      kind.addParameters({ framework, component, ...params });

      (decos || []).forEach(decorator => {
        kind.addDecorator(decorator);
      });

      Object.keys(exports).forEach(key => {
        if (isExportStory(key, meta)) {
          const storyFn = exports[key];
          const { name, parameters, decorators } = storyFn.story || {};
          if (parameters && parameters.decorators) {
            deprecate(() => {},
            `${kindName} => ${name || key}: story.parameters.decorators is deprecated; use story.decorators instead.`)();
          }
          const decoratorParams = decorators ? { decorators } : null;
          const displayNameParams = name ? { displayName: name } : {};
          kind.add(storyNameFromExport(key), storyFn, {
            ...parameters,
            ...decoratorParams,
            ...displayNameParams,
          });
        }
      });
    });
    previousExports = currentExports;
  };

  let loaded = false;
  /**
   * Load a collection of stories. If it has a default export, assume that it is a module-style
   * file and process its named exports as stories. If not, assume it's an old-style
   * storiesof file and simply require it.
   *
   * @param {*} loadable a require.context `req`, an array of `req`s, or a loader function that returns void or an array of exports
   * @param {*} m - ES module object for hot-module-reloading (HMR)
   * @param {*} framework - name of framework in use, e.g. "react"
   */
  const configure = (loadable, m, framework) => {
    if (m && m.hot && m.hot.dispose) {
      ({ previousExports = new Set() } = m.hot.data || {});

      m.hot.dispose(data => {
        loaded = false;
        // eslint-disable-next-line no-param-reassign
        data.previousExports = previousExports;
      });
    }
    if (loaded) {
      logger.warn('Unexpected loaded state. Did you call `load` twice?');
    }
    loaded = true;
    configApi.configure(loadStories(loadable, framework), m);
  };

  return { configure, context, clientApi, configApi, forceReRender };
}
