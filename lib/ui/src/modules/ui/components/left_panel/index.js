import PropTypes from 'prop-types';
import React from 'react';
import pick from 'lodash.pick';
import Header from './header';
import Stories from './stories_tree';
import TextFilter from './text_filter';

const scrollStyle = {
  height: 'calc(100vh - 105px)',
  marginTop: 10,
  overflowY: 'auto',
};

const mainStyle = {
  padding: '10px 0 10px 10px',
};

const storyProps = [
  'storiesHierarchy',
  'selectedKind',
  'selectedHierarchy',
  'selectedStory',
  'onSelectStory',
];

const LeftPanel = props =>
  <div style={mainStyle}>
    <Header name={props.name} url={props.url} openShortcutsHelp={props.openShortcutsHelp} />
    <TextFilter
      text={props.storyFilter}
      onClear={() => props.onStoryFilter('')}
      onChange={text => props.onStoryFilter(text)}
    />
    <div style={scrollStyle}>
      {props.storiesHierarchy ? <Stories {...pick(props, storyProps)} /> : null}
    </div>
  </div>;

LeftPanel.defaultProps = {
  storiesHierarchy: null,
  storyFilter: null,
  onStoryFilter: () => {},
  openShortcutsHelp: null,
  name: '',
  url: '',
};

LeftPanel.propTypes = {
  storiesHierarchy: PropTypes.shape({
    namespaces: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    map: PropTypes.object,
  }),
  storyFilter: PropTypes.string,
  onStoryFilter: PropTypes.func,

  openShortcutsHelp: PropTypes.func,
  name: PropTypes.string,
  url: PropTypes.string,
};

export default LeftPanel;
