import React from 'react';
import FuzzySearch from './FuzzySearch';
import TextFilter from './text_filter';
import ReactModal from 'react-modal';

import modalContent from './modalContent';

const options = {
  keys: ['story', 'kind'],
};

export default class StorybookControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      isModalOpen: false,
    };
    this.formatStoryForSearch = this.formatStoryForSearch.bind(this);
    this.fireOnStory = this.fireOnStory.bind(this);
    this.fireOnKind = this.fireOnKind.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  getKindNames() {
    const { storyStore } = this.props;
    if (!storyStore) {
      return [];
    }
    const kindNames = storyStore.map(({ kind }) => kind);

    const filterdKindNames = kindNames.filter(kind => {
      const { selectedKind } = this.props;
      const { filterText } = this.state;

      if (kind === selectedKind) {
        // Always keep the selected kind name
        return true;
      }

      return kind.toLowerCase().indexOf(filterText.toLowerCase()) > -1;
    });

    return filterdKindNames;
  }

  getStories(kind) {
    const { storyStore } = this.props;
    const storiesInfo = storyStore.find(item => item.kind === kind);

    if (!storiesInfo) {
      return [];
    }
    return storiesInfo.stories;
  }

  fireOnKind(kind, story) {
    const { onKind } = this.props;
    if (onKind) onKind(kind, story);
  }

  fireOnStory(story) {
    const { onStory } = this.props;
    if (onStory) onStory(story);
  }

  filterStoryList(filterText) {
    this.setState({ filterText });
  }

  clearFilterText() {
    this.setState({ filterText: '' });
  }

  formatStoryForSearch() {
    const { storyStore } = this.props;
    if (!storyStore) {
      return [];
    }
    let formattedStories = [];

    storyStore.forEach((kindData) => {
      const stories = kindData.stories.map((story) => {
        return {
          story,
          kind: kindData.kind,
        };
      });
      formattedStories = formattedStories.concat(stories);
    });
    return formattedStories;
  }

  openModal() {
    this.setState({
      isModalOpen: true,
    });
  }

  closeModal() {
    this.setState({
      isModalOpen: false,
    });
  }

  renderStory(story) {
    const { selectedStory } = this.props;
    const storyStyle = {
      fontSize: 13,
      padding: '8px 0px 8px 10px',
      cursor: 'pointer',
    };

    if (story === selectedStory) {
      storyStyle.fontWeight = 'bold';
    }
    return (
      <div
        key={story}
        style={storyStyle}
        onClick={this.fireOnStory.bind(this, story)}
      >
        {story}
      </div>
    );
  }

  renderKind(kind) {
    const kindStyle = {
      fontSize: 15,
      padding: '10px 0px',
      cursor: 'pointer',
      borderBottom: '1px solid #EEE',
    };

    const { selectedKind } = this.props;
    if (kind === selectedKind) {
      const stories = this.getStories(selectedKind);
      kindStyle.fontWeight = 'bold';
      return (
        <div key={kind}>
          <div
            style={kindStyle}
            onClick={this.fireOnKind.bind(this, kind, null)}
          >
            {kind}
          </div>
          <div>
            {stories.map(this.renderStory.bind(this))}
          </div>
        </div>
      );
    }

    return (
      <div
        key={kind}
        style={kindStyle}
        onClick={this.fireOnKind.bind(this, kind, null)}
      >
        {kind}
      </div>
    );
  }

  render() {
    const kindNames = this.getKindNames();
    const mainStyle = {
      fontFamily: `
        -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",
        "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif
      `,
      color: '#444',
    };

    const h1WrapStyle = {
      background: '#F7F7F7',
      paddingBottom: '20px',
      position: 'absolute',
      top: '20px',
      right: '10px',
      left: '20px',
    };

    const h1Style = {
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      fontSize: '12px',
      fontWeight: 'bolder',
      color: '#828282',
      border: '1px solid #C1C1C1',
      textAlign: 'center',
      borderRadius: '2px',
      padding: '5px',
      cursor: 'pointer',
      margin: 0,
      float: 'none',
      overflow: 'hidden',
    };

    const filterTextWrapStyle = {
      position: 'absolute',
      top: '68px',
      right: '10px',
      left: '20px',
    };

    const listStyle = {
      overflowY: 'auto',
      position: 'absolute',
      top: '108px',
      right: '10px',
      bottom: 0,
      left: '20px',
    };

    const shortcutIcon = {
      textTransform: 'uppercase',
      letterSpacing: '3.5px',
      fontSize: 12,
      fontWeight: 'bolder',
      color: 'rgb(130, 130, 130)',
      border: '1px solid rgb(193, 193, 193)',
      textAlign: 'center',
      borderRadius: 2,
      padding: 5,
      cursor: 'pointer',
      margin: 0,
      display: 'inlineBlock',
      paddingLeft: 8,
      float: 'right',
      marginLeft: 5,
    };

    const modalStyles = {
      content: {
        left: '50%',
        bottom: 'initial',
        right: 'initial',
        width: 350,
        marginLeft: -175,
        border: 'none',
        overflow: 'visible',
        fontFamily: 'sans-serif',
        fontSize: 14,
      },
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.74902)',
      },
    };

    const closeButtonStyle = {
      backgroundColor: 'transparent',
      border: 'none',
      position: 'absolute',
      right: -30,
      top: -6,
      color: '#fff',
      fontSize: 22,
      cursor: 'pointer',
      outline: 'none',
    };

    const linkStyle = {
      textDecoration: 'none',
    };

    const linkTarget = 'https://github.com/kadirahq/react-storybook';

    return (
      <div style={mainStyle}>
        <div style={h1WrapStyle}>
          <div style={shortcutIcon} onClick={this.openModal} className="btn">&#8984;</div>
          <a style={linkStyle} href={linkTarget} target="_blank">
            <h3 style={h1Style}>React Storybook</h3>
          </a>
        </div>

        <ReactModal
          isOpen={this.state.isModalOpen}
          onRequestClose={this.closeModal}
          style={modalStyles}
        >
          {modalContent()}
          <button onClick={this.closeModal} style={closeButtonStyle}>&#10005;</button>
        </ReactModal>

        <FuzzySearch
          list={this.formatStoryForSearch()}
          options={options}
          width={430}
          onSelect={this.fireOnKind}
          placeholder="Search by Story or Kind"
        />

        <div style={filterTextWrapStyle}>
          <TextFilter
            filterText={this.state.filterText}
            onChange={this.filterStoryList.bind(this)}
            onClear={this.clearFilterText.bind(this)}
          />
        </div>

        <div style={listStyle}>
          {kindNames.map(this.renderKind.bind(this))}
        </div>
      </div>
    );
  }
}

StorybookControls.propTypes = {
  storyStore: React.PropTypes.array,
  selectedKind: React.PropTypes.string,
  selectedStory: React.PropTypes.string,
  onKind: React.PropTypes.func,
  onStory: React.PropTypes.func,
};
