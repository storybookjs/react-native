import React from 'react';

import VSplit from './vsplit';
import HSplit from './hsplit';
import SplitPane from '@kadira/react-split-pane';
import FuzzySearch from 'react-fuzzy';

import { features } from '../../../../libs/key_events';

const rootStyle = {
  height: '100vh',
  backgroundColor: '#F7F7F7',
};

const fullScreenStyle = {
  height: '100vh',
  border: 0,
  margin: 0,
  padding: 0,
  overflow: 'hidden',
};

const leftPanelStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
};

const downPanelStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  padding: '5px 10px 10px 0',
  boxSizing: 'border-box',
};

const contentPanelStyle = {
  position: 'absolute',
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
  padding: '10px 10px 10px 0',
};

const previewStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#FFF',
  border: '1px solid #ECECEC',
  borderRadius: 4,
};

const searchBoxStyle = {
  position: 'absolute',
  backgroundColor: '#FFF',
  top: '100px',
  left: '50%',
  marginLeft: '-215px',
};

const vsplit = <VSplit />;
const hsplit = <HSplit />;

const onDragStart = function () {
  document.body.classList.add('dragging');
};

const onDragEnd = function () {
  document.body.classList.remove('dragging');
};

const formatStories = function (stories) {
  const formattedStories = [];
  let i = 0;
  stories.forEach((val) => {
    formattedStories.push({
      type: 'kind',
      value: val.kind,
      id: i++,
    });

    val.stories.forEach((story) => {
      formattedStories.push({
        type: 'story',
        value: story,
        id: i++,
        kind: val.kind,
      });
    });
  });

  return formattedStories;
};

const suggestionTemplate = function (props, state, styles) {
  return state.results.map((val, i) => {
    const style = state.selectedIndex === i ? styles.selectedResultStyle : styles.resultsStyle;
    return (
      <div key={i} style={style}>
        {val.value}
          <span style={{ float: 'right', opacity: 0.5 }}>
            {val.type === 'story' ? `in ${val.kind}` : 'Kind'}
            </span>
      </div>
    );
  });
};

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.fireOnStory = this.fireOnStory.bind(this);
    this.fireOnKind = this.fireOnKind.bind(this);
  }

  onSelect(selected) {
    const { actions } = this.props;
    if (selected.type === 'story') this.fireOnStory(selected.value, selected.kind);
    else this.fireOnKind(selected.value);
    actions.shortcuts.handleEvent(features.SEARCH);
  }

  fireOnKind(kind) {
    const onSelectStory = this.props.actions.api.selectStory;
    if (onSelectStory) onSelectStory(kind, null);
  }

  fireOnStory(story, kind) {
    const onSelectStory = this.props.actions.api.selectStory;
    if (onSelectStory) onSelectStory(kind, story);
  }

  renderWithFullscreen() {
    return (
      <div style={fullScreenStyle}>
        {this.props.preview()}
      </div>
    );
  }

  renderNormally() {
    const props = this.props;
    const leftPanelDefaultSize = props.showLeftPanel ? 250 : 1;
    const downPanelDefaultSize = props.showDownPanel ? 200 : 1;
    return (
      <div style={rootStyle}>
        <SplitPane
          split="vertical"
          minSize={leftPanelDefaultSize}
          defaultSize={leftPanelDefaultSize}
          resizerChildren={vsplit}
          onDragStarted={onDragStart}
          onDragFinished={onDragEnd}
        >
          <div style={leftPanelStyle}>
            {props.showLeftPanel ? props.leftPanel() : null}
          </div>

          <SplitPane
            split="horizontal"
            primary="second"
            minSize={100}
            defaultSize={downPanelDefaultSize}
            resizerChildren={hsplit}
            onDragStarted={onDragStart}
            onDragFinished={onDragEnd}
          >
            <div style={contentPanelStyle}>
              <div style={previewStyle}>
                {props.preview()}
              </div>
            </div>
            <div style={downPanelStyle}>
              {props.showDownPanel ? props.downPanel() : null}
            </div>
          </SplitPane>
        </SplitPane>

        <div style={searchBoxStyle}>
          {props.showSearchBox && <FuzzySearch
            list={formatStories(props.stories)}
            onSelect={this.onSelect}
            keys={['value', 'type']}
            resultsTemplate={suggestionTemplate}
            autoFocus
          />}
        </div>
      </div>
    );
  }

  render() {
    const { goFullScreen } = this.props;
    if (goFullScreen) {
      return this.renderWithFullscreen();
    }

    return this.renderNormally();
  }
}

Layout.propTypes = {
  showLeftPanel: React.PropTypes.bool.isRequired,
  showDownPanel: React.PropTypes.bool.isRequired,
  goFullScreen: React.PropTypes.bool.isRequired,
  leftPanel: React.PropTypes.func.isRequired,
  preview: React.PropTypes.func.isRequired,
  downPanel: React.PropTypes.func.isRequired,
  stories: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  showSearchBox: React.PropTypes.bool.isRequired,
  actions: React.PropTypes.object.isRequired,
};

export default Layout;
