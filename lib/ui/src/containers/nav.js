import React from 'react';
import { inject } from 'mobx-react';

import { Nav, Explorer } from '@storybook/components';

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
    uiOptions: {
      name,
      url,

      sortStoriesByKind,
      hierarchySeparator,
      hierarchyRootSeparator,
      sidebarAnimations,
    },
    storyFilter,
  } = store;

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
    title: name,
    url,
    sections: [
      {
        id: 'components',
        name: 'components',
        render: () => (
          <Explorer
            storiesHierarchies={storiesHierarchies}
            storyFilter={storyFilter}
            onStoryFilter={filter => store.setStoryFilter(filter)}
            sidebarAnimations={sidebarAnimations}
            selectedKind={selectedKind}
            selectedHierarchy={selectedHierarchy}
            selectedStory={selectedStory}
          />
        ),
        active: true,
      },
      {
        id: 'settings',
        name: 'settings',
        render: () => <div>Settings NAV</div>,
        active: false,
      },
    ],
    notification: [],

    storiesHierarchies,
    selectedKind,
    selectedStory,
    selectedHierarchy,
    onSelectStory: (kind, story) => store.selectStory(kind, story),
    storyFilter,
    onStoryFilter: filter => store.setStoryFilter(filter),
    sidebarAnimations,
  };
};

export default inject(({ store }) => mapper(store))(Nav);
