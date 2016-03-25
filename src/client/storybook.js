const storybook = {};
let cnt = 0;

export default storybook;
export function addStory(kind, name, fn) {
  if (!storybook[kind]) {
    storybook[kind] = {
      kind,
      index: cnt++,
      stories: {},
    };
  }

  storybook[kind].stories[name] = {
    name,
    index: cnt++,
    fn,
  };
}

export function getStoryKinds() {
  return Object.keys(storybook)
    .map(key => storybook[key])
    .sort((info1, info2) => (info1.index - info2.index))
    .map(info => info.kind);
}

export function getStories(kind) {
  if (!storybook[kind]) {
    return [];
  }

  return Object.keys(storybook[kind].stories)
    .map(name => storybook[kind].stories[name])
    .sort((info1, info2) => (info1.index - info2.index))
    .map(info => info.name);
}

export function getStory(kind, name) {
  const storiesKind = storybook[kind];
  if (!storiesKind) {
    return null;
  }

  const storyInfo = storiesKind.stories[name];
  if (!storyInfo) {
    return null;
  }

  return storyInfo.fn;
}

export function removeStoryKind(kind) {
  delete storybook[kind];
}

export function hasStoryKind(kind) {
  return Boolean(storybook[kind]);
}

export function hasStory(kind, name) {
  return Boolean(getStory(kind, name));
}

export function dumpStoryBook() {
  const data = getStoryKinds()
    .map(kind => ({ kind, stories: getStories(kind) }));

  return data;
}

export function clean() {
  getStoryKinds().forEach(kind => delete storybook[kind]);
}
