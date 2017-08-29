/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import { stripIndents } from 'common-tags';
import isReactRenderable from './element_check';
import ErrorDisplay from './error_display';

// check whether we're running on node/browser
const isBrowser = typeof window !== 'undefined';

const logger = console;

let rootEl = null;
let previousKind = '';
let previousStory = '';

if (isBrowser) {
  rootEl = document.getElementById('root');
}

export function renderError(error) {
  const properError = new Error(error.title);
  properError.stack = error.description;

  const redBox = <ErrorDisplay error={properError} />;
  ReactDOM.render(redBox, rootEl);
}

export function renderException(error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  const realError = new Error(error.message);
  realError.stack = error.stack;
  const redBox = <ErrorDisplay error={realError} />;
  ReactDOM.render(redBox, rootEl);

  // Log the stack to the console. So, user could check the source code.
  logger.error(error.stack);
}

export function renderMain(data, storyStore) {
  if (storyStore.size() === 0) return null;

  const NoPreview = () => <p>No Preview Available!</p>;
  const noPreview = <NoPreview />;
  const { selectedKind, selectedStory } = data;

  const story = storyStore.getStory(selectedKind, selectedStory);
  if (!story) {
    ReactDOM.render(noPreview, rootEl);
    return null;
  }

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
    ReactDOM.unmountComponentAtNode(rootEl);
  }

  const context = {
    kind: selectedKind,
    story: selectedStory,
  };

  const element = story(context);

  if (!element) {
    const error = {
      title: `Expecting a React element from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the React element from the story?
        Use "() => (<MyComp/>)" or "() => { return <MyComp/>; }" when defining the story.
      `,
    };
    return renderError(error);
  }

  if (!isReactRenderable(element)) {
    const error = {
      title: `Expecting a valid React element from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
         Seems like you are not returning a correct React element from the story.
         Could you double check that?
       `,
    };
    return renderError(error);
  }

  ReactDOM.render(element, rootEl);
  return null;
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
