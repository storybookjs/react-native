import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { styled } from '@storybook/theming';

import { EVENTS } from '../constants';
import Event from './Event';

const Wrapper = styled.div({
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px',
  minHeight: '100%',
});

export default class EventsPanel extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
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
    const { channel } = this.props;

    channel.on(EVENTS.ADD, this.onAdd);
  }

  componentWillUnmount() {
    const { channel } = this.props;

    channel.removeListener(EVENTS.ADD, this.onAdd);
  }

  onAdd = events => {
    this.setState({ events });
  };

  onEmit = event => {
    const { channel } = this.props;

    channel.emit(EVENTS.EMIT, event);
  };

  render() {
    const { events } = this.state;
    const { active } = this.props;
    return active ? (
      <Wrapper>
        {events.map(event => (
          <Event key={event.name} {...event} onEmit={this.onEmit} />
        ))}
      </Wrapper>
    ) : null;
  }
}
