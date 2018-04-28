/* global document */

import { stripIndents } from 'common-tags';
import { logger } from '@storybook/client-logger';
import ErrorDisplay from './ErrorDisplay.marko';
import NoPreview from './NoPreview.marko';

// check whether we're running on node/browser
const isBrowser = typeof window !== 'undefined';

let rootEl = null;
let previousKind = '';
let previousStory = '';
let currLoadedComponent = null; // currently loaded marko widget!

if (isBrowser) {
  rootEl = document.getElementById('root');
}

export function renderException(error) {
  currLoadedComponent = ErrorDisplay.renderSync({
    message: error.message,
    stack: error.stack
  }).appendTo(rootEl).getComponent();

  // Log the stack to the console. So, user could check the source code.
  logger.error(error);
}

export function renderMain(data, storyStore, forceRender) {
  if (storyStore.size() === 0) return null;

  console.log('renderMain called!!')
  const { selectedKind, selectedStory } = data;

  const story = storyStore.getStoryWithContext(selectedKind, selectedStory);

  // Unmount the previous story only if selectedKind or selectedStory has changed.
  // renderMain() gets executed after each action. Actions will cause the whole
  // story to re-render without this check.
  //    https://github.com/storybooks/react-storybook/issues/116
  // However, we do want the story to re-render if the store itself has changed
  // (which happens at the moment when HMR occurs)
  if (
    !forceRender &&
    selectedKind === previousKind &&
    previousStory === selectedStory
  ) {
    return null;
  }

  // We need to unmount the existing set of components in the DOM node.
  // Otherwise, React may not recrease instances for every story run.
  // This could leads to issues like below:
  //    https://github.com/storybooks/react-storybook/issues/81
  previousKind = selectedKind;
  previousStory = selectedStory;
  
  // destroy currently loaded component!
  if(currLoadedComponent) {
    currLoadedComponent.destroy();
  }

  // if story not found in context, render no preview!
  if (!story) {
    currLoadedComponent = NoPreview.renderSync({}).appendTo(rootEl).getComponent();
    return null;
  }

  const element = story();
  
  // check if it is marko renderable! (better way to do this?)
  if (!element || !element.out) {
    const error = {
      message: `Expecting a Marko element from the story: "${selectedStory}" of "${selectedKind}".`,
      stack: stripIndents`
        Did you forget to return the Marko element from the story?
        Use "() => MyComp.renderSync({})" or "() => { return MyComp.renderSync({}); }" when defining the story.
      `,
    };  
    return renderException(error);
  }
  
  currLoadedComponent = element.appendTo(rootEl).getComponent();
  // rootEl.innerHTML = element;

  return null;
}

export default function renderPreview({ reduxStore, storyStore }, forceRender = false) {
  const state = reduxStore.getState();
  if (state.error) {
    return renderException(state.error);
  }

  try {
    return renderMain(state, storyStore, forceRender);
  } catch (ex) {
    return renderException(ex);
  }
}
