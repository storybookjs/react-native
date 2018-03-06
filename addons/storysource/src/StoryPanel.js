import React, { Component } from 'react';
import PropTypes from 'prop-types';
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import { darcula } from 'react-syntax-highlighter/styles/prism';
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/prism-light';
import { createElement } from 'react-syntax-highlighter';
import { EVENT_ID } from './';

registerLanguage('jsx', jsx);

const keyCodeEnter = 13;

const styles = {
  story: {
    cursor: 'pointer',
  },
  selectedStory: {
    backgroundColor: 'rgba(255, 242, 60, 0.2)',
  },
  panel: {
    width: '100%',
  },
};

export default class StoryPanel extends Component {
  static areLocationsEqual(a, b) {
    return (
      a.startLoc.line === b.startLoc.line &&
      a.startLoc.col === b.startLoc.col &&
      a.endLoc.line === b.endLoc.line &&
      a.endLoc.col === b.endLoc.col
    );
  }

  static getLocationKeys(locationsMap) {
    return locationsMap
      ? Array.from(Object.keys(locationsMap)).sort(
          (key1, key2) => locationsMap[key1].startLoc.line - locationsMap[key2].startLoc.line
        )
      : [];
  }

  constructor(props) {
    super(props);

    this.state = { source: '// Here will be dragons 🐉' };

    const { channel } = props;

    channel.on(EVENT_ID, ({ source, currentLocation, locationsMap }) => {
      const locationsKeys = StoryPanel.getLocationKeys(locationsMap);

      this.setState({
        source,
        currentLocation,
        locationsMap,
        locationsKeys,
      });
    });

    this.setSelectedStoryRef = this.setSelectedStoryRef.bind(this);
    this.lineRenderer = this.lineRenderer.bind(this);
    this.clickOnStory = this.clickOnStory.bind(this);
    this.keyDownOnStory = this.keyDownOnStory.bind(this);
  }

  componentDidUpdate() {
    if (this.selectedStoryRef) {
      this.selectedStoryRef.scrollIntoView();
    }
  }

  setSelectedStoryRef(ref) {
    this.selectedStoryRef = ref;
  }

  clickOnStory(key) {
    const { api } = this.props;
    const [kind, story] = key.split('@');

    if (kind && story) {
      api.selectStory(kind, story);
    }
  }

  keyDownOnStory(e, key) {
    if (e.keyCode !== keyCodeEnter) {
      return;
    }

    this.clickOnStory(key);
  }

  createPart(rows, stylesheet, useInlineStyles) {
    return rows.map((node, i) =>
      createElement({
        node,
        stylesheet,
        useInlineStyles,
        key: `code-segement${i}`,
      })
    );
  }

  createStoryPart(rows, stylesheet, useInlineStyles, location, kindStory) {
    const { currentLocation } = this.state;
    const first = location.startLoc.line - 1;
    const last = location.endLoc.line;

    const storyRows = rows.slice(first, last);
    const story = this.createPart(storyRows, stylesheet, useInlineStyles);
    const storyKey = `${first}-${last}`;

    if (StoryPanel.areLocationsEqual(location, currentLocation)) {
      return (
        <div key={storyKey} ref={this.setSelectedStoryRef} style={styles.selectedStory}>
          {story}
        </div>
      );
    }

    return (
      <div
        key={storyKey}
        onClick={() => this.clickOnStory(kindStory)}
        onKeyDown={e => this.keyDownOnStory(e, kindStory)}
        tabIndex="0"
        style={styles.story}
        role="link"
      >
        {story}
      </div>
    );
  }

  createParts(rows, stylesheet, useInlineStyles) {
    const { locationsMap, locationsKeys } = this.state;

    const parts = [];
    let lastRow = 0;

    locationsKeys.forEach(key => {
      const location = locationsMap[key];
      const first = location.startLoc.line - 1;
      const last = location.endLoc.line;

      const start = this.createPart(rows.slice(lastRow, first), stylesheet, useInlineStyles);
      const storyPart = this.createStoryPart(rows, stylesheet, useInlineStyles, location, key);

      parts.push(start);
      parts.push(storyPart);

      lastRow = last;
    });

    const lastPart = this.createPart(rows.slice(lastRow), stylesheet, useInlineStyles);

    parts.push(lastPart);

    return parts;
  }

  lineRenderer({ rows, stylesheet, useInlineStyles }) {
    const { locationsMap, locationsKeys } = this.state;

    if (!locationsMap || !locationsKeys.length) {
      return this.createPart(rows, stylesheet, useInlineStyles);
    }

    const parts = this.createParts(rows, stylesheet, useInlineStyles);

    return <span>{parts.map(part => part)}</span>;
  }

  render() {
    return (
      <SyntaxHighlighter
        language="jsx"
        showLineNumbers="true"
        style={darcula}
        renderer={this.lineRenderer}
        customStyle={styles.panel}
      >
        {this.state.source}
      </SyntaxHighlighter>
    );
  }
}

StoryPanel.propTypes = {
  api: PropTypes.shape({
    selectStory: PropTypes.func.isRequired,
  }).isRequired,
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
};
