import PropTypes from 'prop-types';
import React, { Component } from 'react';
import pick from 'lodash.pick';
import Header from './header';
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
  return storiesHierarchy && storiesHierarchy.map.size > 0;
}

class StoriesPanel extends Component {
  renderStories() {
    const { storiesHierarchies } = this.props;

    return storiesHierarchies.map(
      hierarchy =>
        hierarchyContainsStories(hierarchy) && (
          <Stories
            key={hierarchy.name}
            {...pick(this.props, storyProps)}
            storiesHierarchy={hierarchy}
          />
        )
    );
  }

  render() {
    const {
      name,
      onStoryFilter,
      openShortcutsHelp,
      storyFilter,
      url,
      shortcutOptions,
    } = this.props;

    return (
      <div style={mainStyle}>
        <Header
          name={name}
          url={url}
          openShortcutsHelp={shortcutOptions.enableShortcuts && openShortcutsHelp}
          enableShortcutsHelp={shortcutOptions.enableShortcuts}
        />
        <TextFilter
          text={storyFilter}
          onClear={() => onStoryFilter('')}
          onChange={text => onStoryFilter(text)}
        />
        <div style={scrollStyle}>{this.renderStories()}</div>
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
  shortcutOptions: null,
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
  shortcutOptions: PropTypes.shape({
    goFullScreen: PropTypes.bool,
    showStoriesPanel: PropTypes.bool,
    showAddonPanel: PropTypes.bool,
    showSearchBox: PropTypes.bool,
    addonPanelInRight: PropTypes.bool,
    enableShortcuts: PropTypes.bool,
  }),
};

export default StoriesPanel;
