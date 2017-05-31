import PropTypes from 'prop-types';
import React from 'react';
import { baseFonts } from '../theme';

const listStyle = {
  ...baseFonts,
};

const listStyleType = {
  listStyleType: 'none',
  paddingLeft: 0,
};

const kindStyle = {
  fontSize: 15,
  padding: '10px 0px',
  cursor: 'pointer',
  borderBottom: '1px solid #EEE',
};

const storyStyle = {
  fontSize: 13,
  padding: '8px 0px 8px 10px',
  cursor: 'pointer',
};

class Stories extends React.Component {
  constructor(...args) {
    super(...args);
    this.renderKind = this.renderKind.bind(this);
    this.renderStory = this.renderStory.bind(this);
  }

  fireOnKind(kind) {
    const { onSelectStory } = this.props;
    if (onSelectStory) onSelectStory(kind, null);
  }

  fireOnStory(story) {
    const { onSelectStory, selectedKind } = this.props;
    if (onSelectStory) onSelectStory(selectedKind, story);
  }

  renderStory(story) {
    const { selectedStory } = this.props;
    const style = { display: 'block', ...storyStyle };
    const props = {
      onClick: this.fireOnStory.bind(this, story),
    };

    if (story === selectedStory) {
      style.fontWeight = 'bold';
    }

    return (
      <li key={story}>
        <a
          title={`Open ${story}`}
          style={style}
          onClick={props.onClick}
          role="menuitem"
          tabIndex="0"
        >
          {story}
        </a>
      </li>
    );
  }

  renderKind({ kind, stories }) {
    const { selectedKind } = this.props;
    const style = { display: 'block', ...kindStyle };
    const onClick = this.fireOnKind.bind(this, kind);

    if (kind === selectedKind) {
      style.fontWeight = 'bold';
      return (
        <li key={kind}>
          <a title={`Open ${kind}`} style={style} onClick={onClick} role="menuitem" tabIndex="0">
            {kind}
          </a>
          <div>
            <ul style={listStyleType} role="menu">
              {stories.map(this.renderStory)}
            </ul>
          </div>
        </li>
      );
    }

    return (
      <li key={kind}>
        <a title={`Open ${kind}`} style={style} onClick={onClick} role="menuitem" tabIndex="0">
          {kind}
        </a>
      </li>
    );
  }

  render() {
    const { stories } = this.props;
    return (
      <div style={listStyle}>
        <ul style={listStyleType} role="menu">
          {stories.map(this.renderKind)}
        </ul>
      </div>
    );
  }
}

Stories.defaultProps = {
  stories: [],
  onSelectStory: null,
};

Stories.propTypes = {
  stories: PropTypes.arrayOf(
    PropTypes.shape({
      kind: PropTypes.string,
      stories: PropTypes.array,
    })
  ),
  selectedKind: PropTypes.string.isRequired,
  selectedStory: PropTypes.string.isRequired,
  onSelectStory: PropTypes.func,
};

export default Stories;
