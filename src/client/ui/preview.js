import React from 'react';
import ReactDOM from 'react-dom';
import ReadBox from 'redbox-react';
import {
  getStoryStore,
} from '../';

const rootEl = document.getElementById('root');

export function renderError(data, error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  const realError = new Error(error.message);
  realError.stack = error.stack;
  const redBox = (<ReadBox error={realError} />);
  ReactDOM.render(redBox, rootEl);
}

export function renderMain(data) {
  const NoPreview = () => (<p>No Preview Available!</p>);
  const noPreview = (<NoPreview />);
  const { selectedKind, selectedStory } = data;

  const story = getStoryStore().getStory(selectedKind, selectedStory);
  if (!story) {
    return ReactDOM.render(noPreview, rootEl);
  }

  // We need to unmount the existing set of components in the DOM node.
  // Otherwise, React may not recrease instances for every story run.
  // This could leads to issues like below:
  //    https://github.com/kadirahq/react-storybook/issues/81
  ReactDOM.unmountComponentAtNode(rootEl);

  return ReactDOM.render(story(), rootEl);
}

export default function renderPreview(data) {
  if (data.error) {
    return renderError(data, data.error);
  }

  return renderMain(data);
}
