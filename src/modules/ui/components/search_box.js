import React from 'react';
import FuzzySearch from 'react-fuzzy';

import { features } from '../../../libs/key_events';
import { baseFonts } from './theme';

const searchBoxStyle = {
  position: 'absolute',
  backgroundColor: '#FFF',
  top: '100px',
  left: '50%',
  marginLeft: '-215px',
  ...baseFonts
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

export default class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.fireOnStory = this.fireOnStory.bind(this);
    this.fireOnKind = this.fireOnKind.bind(this);
  }

  onSelect(selected) {
    const { handleEvent } = this.props;
    if (selected.type === 'story') this.fireOnStory(selected.value, selected.kind);
    else this.fireOnKind(selected.value);
    handleEvent(features.SEARCH);
  }

  fireOnKind(kind) {
    const { onSelectStory } = this.props;
    if (onSelectStory) onSelectStory(kind, null);
  }

  fireOnStory(story, kind) {
    const { onSelectStory } = this.props;
    if (onSelectStory) onSelectStory(kind, story);
  }

  render() {
    return (
      <div style={searchBoxStyle}>
           {this.props.showSearchBox && <FuzzySearch
             list={formatStories(this.props.stories)}
             onSelect={this.onSelect}
             keys={['value', 'type']}
             resultsTemplate={suggestionTemplate}
             autoFocus
           />}
      </div>
    );
  }
}

SearchBox.propTypes = {
  showSearchBox: React.PropTypes.bool.isRequired,
  stories: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onSelectStory: React.PropTypes.func.isRequired,
  handleEvent: React.PropTypes.func.isRequired,
};
