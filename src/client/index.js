import renderUI from './ui';
import {
  setData,
  getData,
  watchData
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
    return {add};
  }

  return {add};
}

export function getStories() {
  return storybook;
}

export function renderMain(stories) {
  const data = getData();
  data.error = null;

  data.selectedKind =
    (storybook[data.selectedKind])? data.selectedKind : Object.keys(storybook)[0];

  if (data.selectedKind) {
    const stories = storybook[data.selectedKind];
    data.selectedStory =
      (stories[data.selectedStory])? data.selectedStory : Object.keys(stories)[0];
  }

  setData(data);
};

export const renderError = (e) => {
  const data = getData();
  data.error = e;

  setData(data);
};
