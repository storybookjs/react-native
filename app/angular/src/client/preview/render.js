import { renderNgApp, renderNgError, renderNoPreview } from './angular/helpers.ts';

const logger = console;
let previousKind = '';
let previousStory = '';

export function renderError(error) {
  const err = new Error(error.title);
  err.stack = error.description;

  renderNgError(err);
}

export function renderException(error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  const err = new Error(error.message);
  err.stack = error.stack;
  renderNgError(err);

  // Log the stack to the console. So, user could check the source code.
  logger.error(error.stack);
}

export function renderMain(data, storyStore) {
  if (storyStore.size() === 0) return null;

  const { selectedKind, selectedStory } = data;

  const story = storyStore.getStory(selectedKind, selectedStory);
  if (!story) {
    renderNoPreview();
    return null;
  }

  // Unmount the previous story only if selectedKind or selectedStory has changed.
  // renderMain() gets executed after each action. Actions will cause the whole
  // story to re-render without this check.
  //    https://github.com/storybooks/react-storybook/issues/116

  const reRender = selectedKind !== previousKind || previousStory !== selectedStory;
  if (reRender) {
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
  return renderNgApp(story, context, reRender);
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
