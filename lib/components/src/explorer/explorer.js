import PropTypes from 'prop-types';
import React, { Component } from 'react';
import pick from 'lodash.pick';
import styled from 'react-emotion';

import Stories from './tree';
import TextFilter from './text_filter';

const Wrapper = styled('div')(
  ({ isMobileDevice }) =>
    isMobileDevice
      ? {
          padding: '10px',
        }
      : {
          padding: '10px 0 10px 10px',
        }
);

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
class Explorer extends Component {
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

Explorer.defaultProps = {
  storiesHierarchies: [],
  storyFilter: null,
  onStoryFilter: () => {},
  openShortcutsHelp: null,
};

Explorer.propTypes = {
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

export { Explorer };
