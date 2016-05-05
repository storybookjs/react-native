import React from 'react';
import { baseFonts } from '../theme';

const listStyle = {
  overflowY: 'auto',
  marginTop: 10,
  ...baseFonts,
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
    const style = { ...storyStyle };
    const props = {
      key: story,
      style,
      onClick: this.fireOnStory.bind(this, story),
    };

    if (story === selectedStory) {
      style.fontWeight = 'bold';
      props.selectedStory = true;
    }

    return (
      <div {...props}>
        {story}
      </div>
    );
  }

  renderKind({ kind, stories }) {
    const { selectedKind } = this.props;
    const style = { ...kindStyle };

    if (kind === selectedKind) {
      style.fontWeight = 'bold';
      return (
        <div key={kind}>
          <div
            style={style}
            onClick={this.fireOnKind.bind(this, kind)}
            selectedKind
          >
            {kind}
          </div>
          <div>
            {stories.map(this.renderStory)}
          </div>
        </div>
      );
    }

    return (
      <div
        key={kind}
        style={style}
        onClick={this.fireOnKind.bind(this, kind, null)}
      >
        {kind}
      </div>
    );
  }

  render() {
    const { stories } = this.props;
    return (
      <div style={listStyle}>
        {stories.map(this.renderKind)}
      </div>
    );
  }
}

Stories.propTypes = {
  stories: React.PropTypes.array.isRequired,
  selectedKind: React.PropTypes.string.isRequired,
  selectedStory: React.PropTypes.string.isRequired,
  onSelectStory: React.PropTypes.func,
};

export default Stories;
