import React, { Component } from 'react';
// import addons from '@storybook/addons';
import PropTypes from 'prop-types';

import { EVENTS } from '../constants';

import Event from './Event';

const styles = {
  wrapper: {
    fontFamily: `
      -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",
      "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif
    `,
    fontSize: 14,
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px',
    color: 'rgb(51, 51, 51)',
    overflow: 'auto',
  },
};

export default class Events extends Component {
  static propTypes = {
    api: PropTypes.shape({
      onStory: PropTypes.func,
    }).isRequired,
    channel: PropTypes.shape({
      on: PropTypes.func,
      emit: PropTypes.func,
      removeListener: PropTypes.func,
    }).isRequired,
  };

  state = {
    events: [],
  };

  componentDidMount() {
    this.props.channel.on(EVENTS.ADD, this.onAdd);

    this.stopListeningOnStory = this.props.api.onStory(() => {
      this.onAdd([]);
    });
  }

  componentWillUnmount() {
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }

    this.unmounted = true;
    this.props.channel.removeListener(EVENTS.ADD, this.onAdd);
  }

  onAdd = events => {
    this.setState({ events });
  };

  onEmit = event => {
    this.props.channel.emit(EVENTS.EMIT, event);
  };

  render() {
    const { events } = this.state;
    return (
      <div style={styles.wrapper}>
        {events.map(event => <Event key={event.id} {...event} onEmit={this.onEmit} />)}
      </div>
    );
  }
}
