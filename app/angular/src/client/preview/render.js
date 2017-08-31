// import { environment } from './environments/environment';

// import { ErrorComponent } from './error.component.ts';
import { document } from 'global';

import { renderNgApp, renderNgError, renderNoPreview } from './angular/helpers.ts';

// check whether we're running on node/browser
const isBrowser = typeof window !== 'undefined';

const logger = console;
let previousKind = '';
let previousStory = '';
let currentModule = null;

function cleanupRootNode() {
  if (currentModule) {
    currentModule.destroy();
    currentModule = null;
    if (isBrowser) {
      const body = document.body;
      const app = document.createElement('my-app');
      body.appendChild(app);
    }
  }
}

export function renderError(error) {
  const err = new Error(error.title);
  err.stack = error.description;
  cleanupRootNode();

  renderNgError(err, appModule => {
    currentModule = appModule;
  });
}

export function renderException(error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  const err = new Error(error.message);
  err.stack = error.stack;
  renderNgError(err, appModule => {
    currentModule = appModule;
  });

  // Log the stack to the console. So, user could check the source code.
  logger.error(error.stack);
}

export function renderMain(data, storyStore) {
  if (storyStore.size() === 0) return null;

  const { selectedKind, selectedStory } = data;

  const story = storyStore.getStory(selectedKind, selectedStory);
  if (!story) {
    cleanupRootNode();
    renderNoPreview(appModule => {
      currentModule = appModule;
    });
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
    cleanupRootNode();
  }

  const context = {
    kind: selectedKind,
    story: selectedStory,
  };

  const element = story(context);

  // if (!element) {
  //   const error = {
  //     title: `Expecting a React element from the story: "${selectedStory}" of "${selectedKind}".`,
  //     description: stripIndents`
  //       Did you forget to return the React element from the story?
  //       Use "() => (<MyComp/>)" or "() => { return <MyComp/>; }" when defining the story.
  //     `,
  //   };
  //   return renderError(error);
  // }

  // if (element.type === undefined) {
  //   const error = {
  //     title: `Expecting a valid React element from the story: "${selectedStory}" of "${selectedKind}".`,
  //     description: stripIndents`
  //       Seems like you are not returning a correct React element from the story.
  //       Could you double check that?
  //     `,
  //   };
  //   return renderError(error);
  // }
  return renderNgApp(element, appModule => {
    currentModule = appModule;
  });
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
