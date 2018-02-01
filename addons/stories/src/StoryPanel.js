import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/prism-light';
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import { darcula } from 'react-syntax-highlighter/styles/prism';
import { EVENT_ID } from './';

registerLanguage('jsx', jsx);

export default class StoryPanel extends Component {
  constructor(props) {
    super(props);

    this.state = { source: '// Here will be dragons 🐉' };

    const { channel } = props;

    channel.on(EVENT_ID, ({ source }) => {
      this.setState({
        source,
      });
    });
  }

  render() {
    return (
      <SyntaxHighlighter
        language="jsx"
        showLineNumbers="true"
        style={darcula}
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
