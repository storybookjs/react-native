import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { styled } from '@storybook/theming';
import { API } from '@storybook/api';

import { EVENTS } from '../constants';
import Event from './Event';
import { Event as EventType, OnEmitEvent } from '../index';

const Wrapper = styled.div({
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px',
  minHeight: '100%',
});

interface EventsPanelProps {
  active: boolean;
  api: API;
}
interface EventsPanelState {
  events: EventType[];
}

export default class EventsPanel extends Component<EventsPanelProps, EventsPanelState> {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    api: PropTypes.shape({
      emit: PropTypes.func,
      off: PropTypes.func,
      on: PropTypes.func,
    }).isRequired,
  };

  state: EventsPanelState = {
    events: [],
  };

  componentDidMount() {
    const { api } = this.props;

    api.on(EVENTS.ADD, this.onAdd);
  }

  componentWillUnmount() {
    const { api } = this.props;

    api.off(EVENTS.ADD, this.onAdd);
  }

  onAdd = (events: EventType[]) => {
    this.setState({ events });
  };

  onEmit = (event: OnEmitEvent) => {
    const { api } = this.props;
    api.emit(EVENTS.EMIT, event);
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
