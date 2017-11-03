import { document } from 'global';

let previousKind = '';
let previousStory = '';

const rootElement = document.getElementById('root');

export function renderError(error) {
  rootElement.innerHTML = error;
}

export function renderException(error) {
  renderError(error);
  console.error(error.stack);
}

export function renderMain(data, storyStore) {
  if (storyStore.size() === 0) return;
  const { selectedKind, selectedStory } = data;
  const story = storyStore.getStory(selectedKind, selectedStory);

  if (selectedKind !== previousKind || previousStory !== selectedStory) {
    previousKind = selectedKind;
    previousStory = selectedStory;
  } else {
    return;
  }
  const context = {
    kind: selectedKind,
    story: selectedStory,
  };
  const component = story
    ? story(context)
    : "<h1>“I'd far rather be happy than right any day.” ~ Douglas Adams (also no component) </h1>";
  if (!component) {
    renderError(`No component found for ${selectedStory}`);
  }
  rootElement.innerHTML = component;
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
