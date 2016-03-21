import renderUI from './ui';
import {
  setData,
  getData,
  watchData
} from './data';

import stories from './papers';

export function storiesOf(component, m) {
  // XXX: Add a better way to create paper and mutate them.
  m.hot.dispose(() => {
    delete stories[component];
  });

  stories[component] = {};
  function add(storyName, fn) {
    stories[component][storyName] = fn;
    return {add};
  }

  return {add};
}

export function getStories() {
  return stories;
}

export function renderMain(papers) {
  const data = getData();
  data.error = null;

  data.selectedPaper =
    (stories[data.selectedPaper])? data.selectedPaper : Object.keys(stories)[0];

  if (data.selectedPaper) {
    const story = stories[data.selectedPaper];
    data.selectedBlock =
      (story[data.selectedBlock])? data.selectedBlock : Object.keys(story)[0];
  }

  setData(data);
};

export const renderError = (e) => {
  const data = getData();
  data.error = e;

  setData(data);
};
