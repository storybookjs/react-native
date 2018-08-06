import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';
import { polyfill } from 'react-lifecycles-compat';

import ReactModal from 'react-modal';
import FuzzySearch from 'react-fuzzy';
import { withTheme } from 'emotion-theming';
import { css } from 'emotion';

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

class SearchBox extends React.Component {
  onSelect = selected => {
    const { onClose } = this.props;

    if (selected.type === 'story') {
      this.fireOnStory(selected.value, selected.kind);
    } else {
      this.fireOnKind(selected.value);
    }
    onClose();
  };

  onModalOpen = () => {
    if (this.inputRef.refs.searchBox !== null) {
      this.inputRef.refs.searchBox.focus();
    }
  };

  fireOnKind = kind => {
    const { onSelectStory } = this.props;
    if (onSelectStory) {
      onSelectStory(kind, null);
    }
  };

  fireOnStory = (story, kind) => {
    const { onSelectStory } = this.props;
    if (onSelectStory) {
      onSelectStory(kind, story);
    }
  };

  render() {
    const { showSearchBox, onClose, theme, stories } = this.props;

    return (
      <ReactModal
        isOpen={showSearchBox}
        onAfterOpen={this.onModalOpen}
        onRequestClose={onClose}
        className={css({
          fontSize: theme.mainTextColor,
          fontFamily: theme.mainTextFace,
          color: theme.mainTextColor,
        })}
        overlayClassName={css({
          position: 'fixed',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.overlayBackground,
          zIndex: 1,
        })}
        contentLabel="Search"
        shouldReturnFocusAfterClose={false}
      >
        <FuzzySearch
          list={formatStories(stories)}
          onSelect={this.onSelect}
          keys={['value', 'type']}
          resultsTemplate={suggestionTemplate}
          ref={inputRef => {
            this.inputRef = inputRef;
          }}
        />
      </ReactModal>
    );
  }
}

SearchBox.defaultProps = { stories: [] };

SearchBox.propTypes = {
  theme: PropTypes.shape({}).isRequired,
  showSearchBox: PropTypes.bool.isRequired,
  stories: PropTypes.arrayOf(PropTypes.object),
  onSelectStory: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export { SearchBox };
polyfill(SearchBox);
export default withTheme(SearchBox);
