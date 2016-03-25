import {
  setData,
  getData,
} from './data';

import storybook from './storybook';

export function storiesOf(kind, m) {
  // XXX: Add a better way to create stories and mutate them.
  m.hot.dispose(() => {
    delete storybook[kind];
  });

  storybook[kind] = {};
  function add(storyName, fn) {
    storybook[kind][storyName] = fn;
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

export function getStorybookData() {
  const _storybook = {};
  Object.keys(storybook).forEach(kind => {
    const stories = storybook[kind];
    _storybook[kind] = Object.keys(stories);
  });

  return _storybook;
}

export function renderMain() {
  const data = getData();
  data.error = null;
  data.__updatedAt = Date.now();
  data.storybook = getStorybookData();

  if (!data.selectedKind || !storybook[data.selectedKind]) {
    data.selectedKind = Object.keys(storybook)[0];
  }

  const stories = storybook[data.selectedKind];
  if (stories) {
    if (!data.selectedStory || !stories[data.selectedStory]) {
      data.selectedStory = Object.keys(stories)[0];
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
