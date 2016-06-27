import 'airbnb-js-shims';
import React from 'react';
import ReactDOM from 'react-dom';
import ErrorDisplay from './error_display';

const rootEl = document.getElementById('root');
let previousKind = '';
let previousStory = '';

export function renderError(error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  const realError = new Error(error.message);
  realError.stack = error.stack;
  const redBox = (<ErrorDisplay error={realError} />);
  ReactDOM.render(redBox, rootEl);
}

export function renderMain(data, storyStore) {
  if (storyStore.size() === 0) return null;

  const NoPreview = () => (<p>No Preview Available!</p>);
  const noPreview = (<NoPreview />);
  const { selectedKind, selectedStory } = data;

  const story = storyStore.getStory(selectedKind, selectedStory);
  if (!story) {
    return ReactDOM.render(noPreview, rootEl);
  }

  // Unmount the previous story only if selectedKind or selectedStory has changed.
  // renderMain() gets executed after each action. Actions will cause the whole
  // story to re-render without this check.
  //    https://github.com/kadirahq/react-storybook/issues/116
  if (selectedKind !== previousKind || previousStory !== selectedStory) {
    // We need to unmount the existing set of components in the DOM node.
    // Otherwise, React may not recrease instances for every story run.
    // This could leads to issues like below:
    //    https://github.com/kadirahq/react-storybook/issues/81
    previousKind = selectedKind;
    previousStory = selectedStory;
    ReactDOM.unmountComponentAtNode(rootEl);
  }

  const context = {
    kind: selectedKind,
    story: selectedStory,
  };

  try {
    return ReactDOM.render(story(context), rootEl);
  } catch (ex) {
    return renderError(ex);
  }
}

export default function renderPreview({ reduxStore, storyStore }) {
  const state = reduxStore.getState();
  if (state.error) {
    return renderError(state.error);
  }

  return renderMain(state, storyStore);
}
