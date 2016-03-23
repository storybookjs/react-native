import React from 'react';
import ReactDOM from 'react-dom';
import ReadBox from 'redbox-react';
import StorybookControls from './controls';
import Layout from './layout';
import {setData} from '../data';

const rootEl = document.getElementById('root');

export default function renderAdmin(data) {
  if (data.error) {
    return renderError(data, data.error);
  }

  return renderMain(data);
}

export function getControls(data) {
  return (
    <StorybookControls
      storybook={data.storybook}
      selectedKind={data.selectedKind}
      selectedStory={data.selectedStory}
      onKind={setSelectedKind.bind(null, data)}
      onStory={setSelectedStory.bind(null, data)}/>
  );
}

export function getIframe(data) {
  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: '0'
  };

  // We need to send dataId via queryString
  // That's how our data layer can start communicate via the iframe.
  const queryString = `dataId=${data.dataId}`;

  return (
    <iframe
      style={iframeStyle}/>
  );
}

export function renderError(data, error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  const redBox = (<ReadBox error={error}/>);
  const controls = getControls(data);
  const root = (<Layout controls={controls} content={redBox} />);
  ReactDOM.render(root, rootEl);
}

export function renderMain(data) {
  // Inside the main page, we simply render iframe.
  const controls = getControls(data);
  const root = (<Layout controls={controls} content={getIframe(data)}/>);
  ReactDOM.render(root, rootEl);
}

// Event handlers
function setSelectedKind(data, kind) {
  data.selectedKind = kind;
  data.selectedStory = Object.keys(data.storybook[kind])[0];
  setData(data);
}

function setSelectedStory(data, block) {
  data.selectedStory = block;
  setData(data);
}
