import { inject } from 'mobx-react';

import StoriesPanel from '../components/stories_panel';
import * as filters from '../libs/filters';
import {
  prepareStoriesForHierarchy,
  resolveStoryHierarchy,
  resolveStoryHierarchyRoots,
  createHierarchies,
} from '../libs/hierarchy';

export const mapper = store => {
  const {
    stories,
    selectedKind,
    selectedStory,
    uiOptions,
    storyFilter,
    shortcutOptions,
    isMobileDevice,
  } = store;

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
    onSelectStory: (kind, story) => store.selectStory(kind, story),
    shortcutOptions,
    storyFilter,
    onStoryFilter: filter => store.setStoryFilter(filter),
    openShortcutsHelp: () => store.toggleShortcutsHelp(),
    sidebarAnimations,
    isMobileDevice,
    name,
    url,
  };
};

export default inject(({ store }) => mapper(store))(StoriesPanel);
