import StoriesPanel from '../components/stories_panel';
import * as filters from '../libs/filters';
import genPoddaLoader from '../libs/gen_podda_loader';
import compose from '../../../compose';

import {
  prepareStoriesForHierarchy,
  resolveStoryHierarchy,
  createHierarchy,
} from '../libs/hierarchy';

export const mapper = (state, props, { actions }) => {
  const actionMap = actions();

  const { stories, selectedKind, selectedStory, uiOptions, storyFilter } = state;
  const { name, url, sortStoriesByKind, hierarchySeparator, sidebarAnimations } = uiOptions;

  const preparedStories = prepareStoriesForHierarchy(stories, hierarchySeparator);

  const filteredStories = filters.storyFilter(
    preparedStories,
    storyFilter,
    selectedKind,
    selectedStory,
    sortStoriesByKind
  );

  const storiesHierarchy = createHierarchy(filteredStories);
  const selectedHierarchy = resolveStoryHierarchy(selectedKind, hierarchySeparator);

  return {
    storiesHierarchy,
    selectedKind,
    selectedStory,
    selectedHierarchy,
    onSelectStory: actionMap.api.selectStory,

    storyFilter,
    onStoryFilter: actionMap.ui.setStoryFilter,

    openShortcutsHelp: actionMap.ui.toggleShortcutsHelp,
    sidebarAnimations,
    name,
    url,
  };
};

export default compose(genPoddaLoader(mapper))(StoriesPanel);
