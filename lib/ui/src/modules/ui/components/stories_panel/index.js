import PropTypes from 'prop-types';
import React, { Component } from 'react';
import pick from 'lodash-es/pick';
import Header from './header';
import SubHeader from './sub_header';
import Stories from './stories_tree';
import TextFilter from './text_filter';

const scrollStyle = {
  height: 'calc(100vh - 105px)',
  marginTop: 10,
  overflow: 'auto',
};

const mainStyle = {
  padding: '10px 0 10px 10px',
};

const storyProps = [
  'selectedKind',
  'selectedHierarchy',
  'selectedStory',
  'onSelectStory',
  'storyFilter',
  'sidebarAnimations',
];

function hierarchyContainsStories(storiesHierarchy) {
  return storiesHierarchy && storiesHierarchy.map.size;
}

// eslint-disable-next-line react/prefer-stateless-function
class StoriesPanel extends Component {
  render() {
    const {
      name,
      onStoryFilter,
      openShortcutsHelp,
      storiesHierarchies,
      storyFilter,
      url,
    } = this.props;

    return (
      <div style={mainStyle}>
        <Header name={name} url={url} openShortcutsHelp={openShortcutsHelp} />
        <TextFilter
          text={storyFilter}
          onClear={() => onStoryFilter('')}
          onChange={text => onStoryFilter(text)}
        />
        <div style={scrollStyle}>
          {storiesHierarchies.map(
            hierarchy =>
              hierarchyContainsStories(hierarchy) && (
                <div key={hierarchy.name}>
                  {hierarchy.name && <SubHeader>{hierarchy.name}</SubHeader>}
                  <Stories {...pick(this.props, storyProps)} storiesHierarchy={hierarchy} />
                </div>
              )
          )}
        </div>
      </div>
    );
  }
}

StoriesPanel.defaultProps = {
  storiesHierarchies: [],
  storyFilter: null,
  onStoryFilter: () => {},
  openShortcutsHelp: null,
  name: '',
  url: '',
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
  name: PropTypes.string,
  url: PropTypes.string,
};

export default StoriesPanel;
