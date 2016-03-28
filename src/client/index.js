import {
  setData,
  getData,
} from './data';
import Storybook from './storybook';

const storybook = new Storybook();

export function getStorybook() {
  return storybook;
}

export function storiesOf(kind, m) {
  m.hot.dispose(() => {
    storybook.removeStoryKind(kind);
  });

  function add(storyName, fn) {
    storybook.addStory(kind, storyName, fn);
    return { add };
  }

  return { add };
}

export function action(name) {
  return function (...args) {
    const newArgs = { ...args };
    let { actions = [] } = getData();

    // Remove events from the args. Otherwise, it creates a huge JSON string.
    if (
      newArgs[0] &&
      newArgs[0].constructor &&
      /Synthetic/.test(newArgs[0].constructor.name)
    ) {
      newArgs[0] = `[${newArgs[0].constructor.name}]`;
    }

    actions = [{ name, newArgs }].concat(actions.slice(0, 5));
    setData({ actions });
  };
}

export function renderMain() {
  const data = getData();
  data.error = null;
  data.__updatedAt = Date.now();
  data.storybook = storybook.dumpStoryBook();

  if (!storybook.hasStoryKind(data.selectedKind)) {
    data.selectedKind = storybook.getStoryKinds()[0];
  }

  if (storybook.hasStoryKind(data.selectedKind)) {
    if (!storybook.hasStory(data.selectedKind, data.selectedStory)) {
      data.selectedStory = storybook.getStories(data.selectedKind, data.selectedStory)[0];
    }
  }

  setData(data);
}

export const renderError = (e) => {
  const data = getData();
  const { stack, message } = e;
  data.error = { stack, message };

  setData(data);
};

export function configure(loaders, module) {
  const render = () => {
    function renderApp() {
      loaders();
      renderMain();
    }

    try {
      renderApp();
    } catch (error) {
      renderError(error);
    }
  };

  if (module.hot) {
    module.hot.accept(() => {
      setTimeout(render);
    });
  }

  render();
}
