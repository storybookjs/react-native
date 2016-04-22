import React from 'react';
import ReactDOM from 'react-dom';
import StorybookControls from './controls';
import ActionLogger from './action_logger';
import Layout from './layout';
import { getSyncedStore } from '../';

const rootEl = document.getElementById('root');
const syncedStore = getSyncedStore();

// Event handlers
function setSelectedKind(data, kind, story) {
  const newData = { ...data };
  const stories = newData.storyStore
    .find(item => item.kind === kind).stories;

  newData.selectedKind = kind;
  newData.selectedStory = story || stories[0];
  syncedStore.setData(newData);
}

function setSelectedStory(data, block) {
  const newData = { ...data };
  newData.selectedStory = block;
  syncedStore.setData(newData);
}

function clearLogs() {
  const data = syncedStore.getData();
  data.actions = [];
  syncedStore.setData(data);
}

export function getControls(data) {
  return (
    <StorybookControls
      storyStore={data.storyStore}
      selectedKind={data.selectedKind}
      selectedStory={data.selectedStory}
      onKind={setSelectedKind.bind(null, data)}
      onStory={setSelectedStory.bind(null, data)}
      syncedStore={syncedStore}
    />
  );
}

export function getIframe(data) {
  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: '1px solid #ECECEC',
    borderRadius: 4,
    backgroundColor: '#FFF',
  };

  // We need to send dataId via queryString
  // That's how our data layer can start communicate via the iframe.
  const queryString = `dataId=${data.dataId}`;

  return (
    <iframe
      style={iframeStyle}
      src={`iframe.html?${queryString}`}
    />
  );
}

export function getActionLogger(data) {
  const { actions = [] } = data;
  return (<ActionLogger actions={actions} onClear={clearLogs} />);
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
      showControls={data.showControls}
      showLogger={data.showLogger}
    />
  );

  ReactDOM.render(root, rootEl);
}

export default function renderAdmin(data) {
  return renderMain(data);
}
