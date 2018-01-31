import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EVENT_ID } from './';

export default class StoryPanel extends Component {
  constructor(props) {
    super(props);

    this.state = { source: '' };

    const { channel } = props;

    channel.on(EVENT_ID, ({ source }) => {
      this.setState({
        source,
      });
    });
  }

  render() {
    return (
      <pre>
        <code>{this.state.source}</code>
      </pre>
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
