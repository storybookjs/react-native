import React from 'react';
import ReactDOM from 'react-dom';
import stringify from 'json-stringify-safe';
import StorybookControls from './controls';
import ActionLogger from './action_logger';
import Layout from './layout';
import { setData } from '../data';

const rootEl = document.getElementById('root');

// Event handlers
function setSelectedKind(data, kind) {
  const newData = { ...data };
  const stories = newData.storybook
    .find(item => item.kind === kind).stories;

  newData.selectedKind = kind;
  newData.selectedStory = stories[0];
  setData(newData);
}

function setSelectedStory(data, block) {
  const newData = { ...data };
  newData.selectedStory = block;
  setData(newData);
}

export function getControls(data) {
  return (
    <StorybookControls
      storybook={data.storybook}
      selectedKind={data.selectedKind}
      selectedStory={data.selectedStory}
      onKind={setSelectedKind.bind(null, data)}
      onStory={setSelectedStory.bind(null, data)}
    />
  );
}

export function getIframe(data) {
  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: '0',
  };

  // We need to send dataId via queryString
  // That's how our data layer can start communicate via the iframe.
  const queryString = `dataId=${data.dataId}`;

  return (
    <iframe
      style={iframeStyle}
      src={`/iframe?${queryString}`}
    />
  );
}

export function getActionLogger(data) {
  const { actions = [] } = data;
  const log = actions
    .map(action => stringify(action, null, 2))
    .join('\n\n');

  return (<ActionLogger actionLog={log} />);
}

export function renderMain(data) {
  // Inside the main page, we simply render iframe.
  const controls = getControls(data);
  const iframe = getIframe(data);
  const actionLogger = getActionLogger(data);

  const root = (
    <Layout
      controls={controls}
      preview={iframe}
      actionLogger={actionLogger}
    />
  );

  ReactDOM.render(root, rootEl);
}

export default function renderAdmin(data) {
  return renderMain(data);
}
