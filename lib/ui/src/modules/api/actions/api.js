import pick from 'lodash.pick';

export function jumpToStory(storyKinds, selectedKind, selectedStory, direction) {
  const flatteredStories = [];
  let currentIndex = -1;

  storyKinds.forEach(({ kind, stories }) => {
    stories.forEach(story => {
      flatteredStories.push({ kind, story });
      if (kind === selectedKind && story === selectedStory) {
        currentIndex = flatteredStories.length - 1;
      }
    });
  });

  const jumpedStory = flatteredStories[currentIndex + direction];
  if (!jumpedStory) {
    return { selectedKind, selectedStory };
  }

  return {
    selectedKind: jumpedStory.kind,
    selectedStory: jumpedStory.story,
  };
}

export function ensureKind(storyKinds, selectedKind) {
  if (!storyKinds) return selectedKind;

  const found = storyKinds.find(item => item.kind === selectedKind);
  if (found) return found.kind;
  // if the selected kind is non-existant, select the first kind
  const kinds = storyKinds.map(item => item.kind);
  return kinds[0];
}

export function ensureStory(storyKinds, selectedKind, selectedStory) {
  if (!storyKinds) return selectedStory;

  const kindInfo = storyKinds.find(item => item.kind === selectedKind);
  if (!kindInfo) return null;

  const found = kindInfo.stories.find(item => item === selectedStory);
  if (found) return found;

  // if the selected story is non-existant, select the first story
  return kindInfo.stories[0];
}

export function ensurePanel(panels, selectedPanel, currentPanel) {
  if (Object.keys(panels).indexOf(selectedPanel) >= 0) return selectedPanel;
  // if the selected panel is non-existant, select the current panel
  // and output to console all available panels
  const logger = console;
  logger.group('Available Panels ID:');
  Object.keys(panels).forEach(panelID => logger.log(`${panelID} (${panels[panelID].title})`));
  logger.groupEnd('Available Panels ID:');
  return currentPanel;
}

export default {
  setStories({ clientStore }, stories) {
    clientStore.update(state => {
      const selectedKind = ensureKind(stories, state.selectedKind);
      const currentSelectedStory = selectedKind === state.selectedKind ? state.selectedStory : null;
      const selectedStory = ensureStory(stories, selectedKind, currentSelectedStory);

      return {
        stories,
        selectedStory,
        selectedKind,
      };
    });
  },

  selectStory({ clientStore }, kind, story) {
    clientStore.update(state => {
      const selectedKind = ensureKind(state.stories, kind);
      const selectedStory = ensureStory(state.stories, selectedKind, story);

      return { selectedKind, selectedStory };
    });
  },

  jumpToStory({ clientStore }, direction) {
    clientStore.update(state =>
      jumpToStory(state.stories, state.selectedKind, state.selectedStory, direction)
    );
  },

  setOptions(env, options) {
    const { clientStore, provider } = env;
    clientStore.update(state => {
      const newOptions = pick(options, Object.keys(state.uiOptions));
      const updatedUiOptions = {
        ...state.uiOptions,
        ...newOptions,
      };
      const otherOptions = {};
      if (Object.keys(pick(options, ['selectedAddonPanel'])).length) {
        otherOptions.selectedAddonPanel = ensurePanel(
          provider.getPanels(),
          options.selectedAddonPanel,
          state.selectedAddonPanel
        );
      }
      return { uiOptions: updatedUiOptions, ...otherOptions };
    });
  },

  setQueryParams({ clientStore }, customQueryParams) {
    clientStore.update(state => {
      const updatedQueryParams = {
        ...state.customQueryParams,
        ...customQueryParams,
      };

      Object.keys(customQueryParams).forEach(key => {
        if (updatedQueryParams[key] === null) {
          delete updatedQueryParams[key];
        }
      });

      return {
        customQueryParams: updatedQueryParams,
      };
    });
  },
};
