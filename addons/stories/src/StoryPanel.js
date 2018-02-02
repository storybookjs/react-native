import React, { Component } from 'react';
import PropTypes from 'prop-types';
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import { darcula } from 'react-syntax-highlighter/styles/prism';
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/prism-light';
import { createElement } from 'react-syntax-highlighter';
import { EVENT_ID } from './';

registerLanguage('jsx', jsx);

export default class StoryPanel extends Component {
  constructor(props) {
    super(props);

    this.state = { source: '// Here will be dragons 🐉' };

    const { channel } = props;

    channel.on(EVENT_ID, ({ source, location }) => {
      this.setState({
        source,
        location,
      });
    });

    this.lineRenderer = this.lineRenderer.bind(this);
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

  lineRenderer({ rows, stylesheet, useInlineStyles }) {
    const { location } = this.state;

    if (location) {
      const first = location.startLoc.line - 1;
      const last = location.endLoc.line;

      const start = this.createPart(rows.slice(0, first), stylesheet, useInlineStyles);
      const selected = this.createPart(rows.slice(first, last), stylesheet, useInlineStyles);
      const end = this.createPart(rows.slice(last), stylesheet, useInlineStyles);

      return (
        <span>
          {start}
          <div style={{ backgroundColor: 'rgba(255, 242, 60, 0.2)' }}>{selected}</div>
          {end}
        </span>
      );
    }

    return this.createPart(rows, stylesheet, useInlineStyles);
  }

  render() {
    return (
      <SyntaxHighlighter
        language="jsx"
        showLineNumbers="true"
        style={darcula}
        renderer={this.lineRenderer}
        customStyle={{ width: '100%' }}
      >
        {this.state.source}
      </SyntaxHighlighter>
    );
  }
}

StoryPanel.propTypes = {
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
};
