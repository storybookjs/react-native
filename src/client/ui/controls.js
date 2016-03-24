import React from 'react';

export default class StorybookControls extends React.Component {
  render() {
    const kindNames = this.getKindNames();
    const mainStyle = {
      fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
      padding: '20px 10px 10px 10px',
      color: '#444'
    };

    const h1Style = {
      textTransform: 'uppercase',
      letterSpacing: '3.5px',
      fontSize: '12px',
      fontWeight: 'bolder',
      color: '#828282',
      border: '1px solid #C1C1C1',
      textAlign: 'center',
      borderRadius: '2px',
      padding: '5px',
      margin: '0 0 20px 0',
      cursor: 'default'
    };

    return (
      <div style={mainStyle}>
        <h3 style={h1Style}>React Storybook</h3>
        <div>
          {kindNames.map(this.renderKind.bind(this))}
        </div>
      </div>
    )
  }

  renderKind(kind) {
    const kindStyle = {
      fontSize: 16,
      padding: '10px 0px',
      cursor: 'pointer',
      borderBottom: '1px solid #EEE'
    };

    const {selectedKind} = this.props;
    if (kind === selectedKind) {
      const stories = this.getStories(selectedKind);
      kindStyle.fontWeight = 'bold';
      return (
        <div key={kind}>
          <div
            style={kindStyle}
            onClick={this.fireOnKind.bind(this, kind)}
            >{kind}</div>
          <div>
            {stories.map(this.renderStory.bind(this))}
          </div>
        </div>
      );
    }

    return (<div
      key={kind}
      style={kindStyle}
      onClick={this.fireOnKind.bind(this, kind)}
      >{kind}</div>);
  }

  renderStory(story) {
    const {selectedStory} = this.props;
    const storyStyle = {
      fontSize: 14,
      padding: '8px 0px 8px 3px',
      cursor: 'pointer',
    };

    if (story === selectedStory) {
      storyStyle.fontWeight = 'bold';
    }
    return (<div
      key={story}
      style={storyStyle}
      onClick={this.fireOnStory.bind(this, story)}
      >{story}</div>);
  }

  getKindNames() {
    const {storybook, selectedKind} = this.props;
    if (!storybook) {
      return [];
    }

    return Object
      .keys(storybook)
      .sort(name => name === selectedKind? -1 : 1);
  }

  getStories(kind) {
    const {storybook} = this.props;
    return storybook[kind];
  }

  fireOnKind(kind) {
    const {onKind = function() {}} = this.props;
    onKind(kind);
  }

  fireOnStory(story) {
    const {onStory = function() {}} = this.props;
    onStory(story);
  }
}
