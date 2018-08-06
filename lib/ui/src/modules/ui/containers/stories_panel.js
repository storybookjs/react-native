import React from 'react';
import { Consumer } from '../../../state';

import * as filters from '../libs/filters';
import StoriesPanel from '../components/stories_panel';

// import genPoddaLoader from '../libs/gen_podda_loader';
// import compose from '../../../compose';

import {
  prepareStoriesForHierarchy,
  resolveStoryHierarchy,
  resolveStoryHierarchyRoots,
  createHierarchies,
} from '../libs/hierarchy';

export const mapper = state => {
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
    onSelectStory: (...args) => {
      console.log('onSelectStory', args);
    },
    shortcutOptions,

    storyFilter,
    onStoryFilter: (...args) => {
      console.log('onStoryFilter', args);
    },
    openShortcutsHelp: (...args) => {
      console.log('openShortcutsHelp', args);
    },
    sidebarAnimations,
    isMobileDevice,
    name,
    url,
  };
};

export default props => (
  <Consumer>
    {state => {
      const finalProps = {
        ...props,
        ...mapper(state),
      };

      return <StoriesPanel {...finalProps} />;
    }}
  </Consumer>
);
