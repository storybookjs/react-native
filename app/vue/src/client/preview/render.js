import Vue from 'vue';
import ErrorDisplay from './ErrorDisplay.vue';
import NoPreview from './NoPreview.vue';

import { window } from 'global';
import { stripIndents } from 'common-tags';

// check whether we're running on node/browser
const isBrowser = typeof window !== 'undefined';

const logger = console;
let previousKind = '';
let previousStory = '';
let app = null;
let err = null;

function renderErrorDisplay(error) {
  if (err) err.$destroy();

  err = new Vue({
    el: '#error-display',
    render(h) {
      return h('div', { attrs: { id: 'error-display' } }, error
        ? [h(ErrorDisplay, { props: { message: error.message, stack: error.stack } }) ]
        : []
      );
    },
  });
}

export function renderError(error) {
  renderErrorDisplay(error);
}

export function renderException(error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  renderErrorDisplay(error);

  // Log the stack to the console. So, user could check the source code.
  logger.error(error.stack);
}

function renderRoot(options) {
  if (err) {
    renderErrorDisplay(null); // clear
    err = null;
  }

  if (app) app.$destroy();

  app = new Vue(options);
}

export function renderMain(data, storyStore) {
  if (storyStore.size() === 0) return null;

  const { selectedKind, selectedStory } = data;

  const story = storyStore.getStory(selectedKind, selectedStory);

  // Unmount the previous story only if selectedKind or selectedStory has changed.
  // renderMain() gets executed after each action. Actions will cause the whole
  // story to re-render without this check.
  //    https://github.com/storybooks/react-storybook/issues/116
  if (selectedKind !== previousKind || previousStory !== selectedStory) {
    // We need to unmount the existing set of components in the DOM node.
    // Otherwise, React may not recrease instances for every story run.
    // This could leads to issues like below:
    //    https://github.com/storybooks/react-storybook/issues/81
    previousKind = selectedKind;
    previousStory = selectedStory;
  }

  const context = {
    kind: selectedKind,
    story: selectedStory,
  };

  const component = story ? story(context) : NoPreview;

  if (!component) {
    const error = {
      message: `Expecting a Vue component from the story: "${selectedStory}" of "${selectedKind}".`,
      stack: stripIndents`
        Did you forget to return the Vue component from the story?
        Use "() => ({ template: '<my-comp></my-comp>' })" or "() => ({ components: MyComp, template: '<my-comp></my-comp>' })" when defining the story.
      `,
    };
    return renderError(error);
  }

  renderRoot({
    el: '#root',
    render(h) {
      return h('div', { attrs: { id: 'root' } }, [h(component)]);
    },
  });
}

export default function renderPreview({ reduxStore, storyStore }) {
  const state = reduxStore.getState();
  if (state.error) {
    return renderException(state.error);
  }

  try {
    return renderMain(state, storyStore);
  } catch (ex) {
    return renderException(ex);
  }
}
