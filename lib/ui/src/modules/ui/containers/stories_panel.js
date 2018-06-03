import StoriesPanel from '../components/stories_panel';
import * as filters from '../libs/filters';
import genPoddaLoader from '../libs/gen_podda_loader';
import compose from '../../../compose';

import {
  prepareStoriesForHierarchy,
  resolveStoryHierarchy,
  resolveStoryHierarchyRoots,
  createHierarchies,
} from '../libs/hierarchy';

export const mapper = (state, props, { actions }) => {
  const actionMap = actions();

  const {
    stories,
    selectedKind,
    selectedStory,
    uiOptions,
    storyFilter,
    shortcutOptions,
    isMobileDevice,
  } = state;

  const {
    sortStoriesByKind,
    hierarchySeparator,
    hierarchyRootSeparator,
    sidebarAnimations,
    name,
    url,
  } = uiOptions;

  const preparedStories = prepareStoriesForHierarchy(
    stories,
    hierarchySeparator,
    hierarchyRootSeparator
  );

  const filteredStories = filters.storyFilter(
    preparedStories,
    storyFilter,
    selectedKind,
    selectedStory,
    sortStoriesByKind
  );

  const storiesHierarchies = createHierarchies(filteredStories);

  const { storyName } = resolveStoryHierarchyRoots(selectedKind, hierarchyRootSeparator);
  const selectedHierarchy = resolveStoryHierarchy(storyName, hierarchySeparator);

  return {
    storiesHierarchies,
    selectedKind,
    selectedStory,
    selectedHierarchy,
    onSelectStory: actionMap.api.selectStory,
    shortcutOptions,

    storyFilter,
    onStoryFilter: actionMap.ui.setStoryFilter,
    openShortcutsHelp: actionMap.ui.toggleShortcutsHelp,
    sidebarAnimations,
    isMobileDevice,
    name,
    url,
  };
};

export default compose(
  genPoddaLoader(mapper),
  { withRef: false }
)(StoriesPanel);
