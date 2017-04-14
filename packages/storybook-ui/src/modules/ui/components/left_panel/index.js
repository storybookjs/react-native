import PropTypes from 'prop-types';
import React from 'react';
import Header from './header';
import Stories from './stories';
import TextFilter from './text_filter';
import pick from 'lodash.pick';

const scrollStyle = {
  height: 'calc(100vh - 105px)',
  marginTop: 10,
  overflowY: 'auto',
};

const mainStyle = {
  padding: '10px 0 10px 10px',
};

const storyProps = ['stories', 'selectedKind', 'selectedStory', 'onSelectStory'];

const LeftPanel = props => (
  <div style={mainStyle}>
    <Header name={props.name} url={props.url} openShortcutsHelp={props.openShortcutsHelp} />
    <TextFilter
      text={props.storyFilter}
      onClear={() => props.onStoryFilter('')}
      onChange={text => props.onStoryFilter(text)}
    />
    <div style={scrollStyle}>
      {props.stories ? <Stories {...pick(props, storyProps)} /> : null}
    </div>
  </div>
);

LeftPanel.propTypes = {
  stories: PropTypes.array,
  selectedKind: PropTypes.string,
  selectedStory: PropTypes.string,
  onSelectStory: PropTypes.func,

  storyFilter: PropTypes.string,
  onStoryFilter: PropTypes.func,

  openShortcutsHelp: PropTypes.func,
  name: PropTypes.string,
  url: PropTypes.string,
};

export default LeftPanel;
