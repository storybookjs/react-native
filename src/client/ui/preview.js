import React from 'react';
import ReactDOM from 'react-dom';
import ReadBox from 'redbox-react';
import storybook from '../storybook';

const rootEl = document.getElementById('root');

export default function renderPreview(data) {
  if (data.error) {
    return renderError(data, data.error);
  }

  return renderMain(data);
}

export function renderError(data, error) {
  debugger;
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  const redBox = (<ReadBox error={error}/>);
  ReactDOM.render(redBox, rootEl);
}

export function renderMain(data) {
  const {selectedKind, selectedStory} = data;
  if (selectedKind && selectedStory) {
    const main = storybook[selectedKind][selectedStory];
    ReactDOM.render(main(), rootEl);
  }
}
