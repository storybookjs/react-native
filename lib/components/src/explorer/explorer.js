import PropTypes from 'prop-types';
import React, { Component } from 'react';
import pick from 'lodash.pick';
import styled from 'react-emotion';

import { TreeState, Container } from '../treeview/treeview';
import TextFilter from './text_filter';

const Wrapper = styled('div')({});

const storyProps = [
  'selectedKind',
  'selectedHierarchy',
  'selectedStory',
  'onSelectStory',
  'storyFilter',
  'sidebarAnimations',
];

// function hierarchyContainsStories(storiesHierarchy) {
//   return storiesHierarchy && storiesHierarchy.children.size > 0;
// }

// This component gets a ref so it needs to be a class
// eslint-disable-next-line react/prefer-stateless-function
class Explorer extends Component {
  render() {
    const { onStoryFilter, stories, storyFilter } = this.props;

    return (
      <Wrapper>
        <TextFilter
          text={storyFilter}
          onClear={() => onStoryFilter('')}
          onChange={text => onStoryFilter(text)}
        />
        <Container>
          <TreeState dataset={stories} prefix="explorer" />
        </Container>
      </Wrapper>
    );
  }
}

Explorer.defaultProps = {
  storiesHierarchies: [],
  storyFilter: null,
  onStoryFilter: () => {},
};

Explorer.propTypes = {
  stories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      children: PropTypes.arrayOf(),
    })
  ),
  storyFilter: PropTypes.string,
  onStoryFilter: PropTypes.func,
};

export { Explorer };
