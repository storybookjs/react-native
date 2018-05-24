import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import ReactModal from 'react-modal';
import FuzzySearch from 'react-fuzzy';

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

const SuggestionWrapper = styled('div')(
  ({ selected, selectedResultStyle, resultsStyle }) =>
    selected ? selectedResultStyle : resultsStyle,
  { display: 'flex', justifyContent: 'space-between' }
);
const SuggestionValue = styled('p')({ margin: 0 });
const SuggestionKind = styled('p')({
  opacity: 0.5,
  margin: 0,
  paddingLeft: 10,
  textAlign: 'right',
});

const suggestionTemplate = (props, state, styles, clickHandler) =>
  state.results.map((val, i) => (
    <SuggestionWrapper
      selected={state.selectedIndex === i}
      {...styles}
      tabIndex={0}
      role="option"
      aria-selected={state.selectedIndex === i}
      key={`${val.value}_${val.id}`}
      onClick={() => clickHandler(i)}
    >
      <SuggestionValue>{val.value}</SuggestionValue>
      <SuggestionKind>{val.type === 'story' ? `in ${val.kind}` : 'Kind'}</SuggestionKind>
    </SuggestionWrapper>
  ));

export default class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.fireOnStory = this.fireOnStory.bind(this);
    this.fireOnKind = this.fireOnKind.bind(this);
    this.inputRef = this.inputRef.bind(this);
    this.onModalOpen = this.onModalOpen.bind(this);
  }

  onSelect(selected) {
    const { onClose } = this.props;
    if (selected.type === 'story') {
      this.fireOnStory(selected.value, selected.kind);
    } else {
      this.fireOnKind(selected.value);
    }
    onClose();
  }

  onModalOpen() {
    if (this.input != null) {
      this.input.focus();
    }
  }

  fireOnKind(kind) {
    const { onSelectStory } = this.props;
    if (onSelectStory) {
      onSelectStory(kind, null);
    }
  }

  fireOnStory(story, kind) {
    const { onSelectStory } = this.props;
    if (onSelectStory) {
      onSelectStory(kind, story);
    }
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
        onAfterOpen={this.onModalOpen}
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
          innerRef={inputRef => {
            this.inputRef = inputRef;
          }}
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
