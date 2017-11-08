import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import FuzzySearch from '@storybook/react-fuzzy';

import { baseFonts } from '@storybook/components';

const modalStyle = {
  content: {
    top: '100px',
    right: 'auto',
    bottom: 'auto',
    left: '50%',
    marginLeft: '-215px',
    border: 'none',
    padding: 0,
    overflow: 'visible',
    ...baseFonts,
  },
  overlay: {
    background: 'transparent',
    zIndex: '1',
  },
};

const formatStories = stories => {
  const formattedStories = [];
  let i = 0;
  stories.forEach(val => {
    i += 1;
    formattedStories.push({
      type: 'kind',
      value: val.kind,
      id: i,
    });

    val.stories.forEach(story => {
      i += 1;
      formattedStories.push({
        type: 'story',
        value: story,
        id: i,
        kind: val.kind,
      });
    });
  });

  return formattedStories;
};

const suggestionTemplate = (props, state, styles) =>
  state.results.map((val, i) => {
    const style = state.selectedIndex === i ? styles.selectedResultStyle : styles.resultsStyle;
    return (
      <div key={val.value} style={style}>
        {val.value}
        <span style={{ float: 'right', opacity: 0.5 }}>
          {val.type === 'story' ? `in ${val.kind}` : 'Kind'}
        </span>
      </div>
    );
  });

export default class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.fireOnStory = this.fireOnStory.bind(this);
    this.fireOnKind = this.fireOnKind.bind(this);
    this.inputRef = this.inputRef.bind(this);
  }

  componentDidUpdate(prevProps) {
    // focus search box on opening
    if (this.props.showSearchBox && !prevProps.showSearchBox && this.input != null) {
      this.input.focus();
    }
  }

  onSelect(selected) {
    const { onClose } = this.props;
    if (selected.type === 'story') this.fireOnStory(selected.value, selected.kind);
    else this.fireOnKind(selected.value);
    onClose();
  }

  fireOnKind(kind) {
    const { onSelectStory } = this.props;
    if (onSelectStory) onSelectStory(kind, null);
  }

  fireOnStory(story, kind) {
    const { onSelectStory } = this.props;
    if (onSelectStory) onSelectStory(kind, story);
  }

  inputRef(fuzzy) {
    if (fuzzy != null) {
      this.input = fuzzy.refs.searchBox;
    }
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.showSearchBox}
        onRequestClose={this.props.onClose}
        style={modalStyle}
        contentLabel="Search"
        shouldReturnFocusAfterClose={false}
      >
        <FuzzySearch
          list={formatStories(this.props.stories)}
          onSelect={this.onSelect}
          keys={['value', 'type']}
          resultsTemplate={suggestionTemplate}
          ref={this.inputRef}
        />
      </ReactModal>
    );
  }
}

SearchBox.defaultProps = { stories: [] };

SearchBox.propTypes = {
  showSearchBox: PropTypes.bool.isRequired,
  stories: PropTypes.arrayOf(PropTypes.object),
  onSelectStory: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
