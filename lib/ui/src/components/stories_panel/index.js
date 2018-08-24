import PropTypes from 'prop-types';
import React, { Component } from 'react';
import pick from 'lodash.pick';
import styled from '@emotion/styled';

import Stories from './stories_tree';
import TextFilter from './text_filter';

const Wrapper = styled.div({});

const storyProps = [
  'selectedKind',
  'selectedHierarchy',
  'selectedStory',
  'onSelectStory',
  'storyFilter',
  'sidebarAnimations',
];

function hierarchyContainsStories(storiesHierarchy) {
  return storiesHierarchy && storiesHierarchy.map.size > 0;
}

// This component gets a ref so it needs to be a class
// eslint-disable-next-line react/prefer-stateless-function
class StoriesPanel extends Component {
  render() {
    const { onStoryFilter, storiesHierarchies, storyFilter } = this.props;

    return (
      <Wrapper>
        <TextFilter
          text={storyFilter}
          onClear={() => onStoryFilter('')}
          onChange={text => onStoryFilter(text)}
        />
        {storiesHierarchies.map(
          hierarchy =>
            hierarchyContainsStories(hierarchy) && (
              <Stories
                key={hierarchy.name}
                {...pick(this.props, storyProps)}
                storiesHierarchy={hierarchy}
              />
            )
        )}
      </Wrapper>
    );
  }
}

StoriesPanel.defaultProps = {
  storiesHierarchies: [],
  storyFilter: null,
  onStoryFilter: () => {},
  openShortcutsHelp: null,
};

StoriesPanel.propTypes = {
  storiesHierarchies: PropTypes.arrayOf(
    PropTypes.shape({
      namespaces: PropTypes.arrayOf(PropTypes.string),
      name: PropTypes.string,
      map: PropTypes.object,
    })
  ),
  storyFilter: PropTypes.string,
  onStoryFilter: PropTypes.func,

  openShortcutsHelp: PropTypes.func,
};

export default StoriesPanel;
