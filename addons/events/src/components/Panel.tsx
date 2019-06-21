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

export default class EventsPanel extends Component<any, any> {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    api: PropTypes.shape({
      emit: PropTypes.func,
      off: PropTypes.func,
      on: PropTypes.func,
    }).isRequired,
  };

  state: any = {
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

  onAdd = (events: any) => {
    this.setState({ events });
  };

  onEmit = (event: any) => {
    const { api } = this.props;

    api.emit(EVENTS.EMIT, event);
  };

  render() {
    const { events } = this.state;
    const { active } = this.props;
    return active ? (
      <Wrapper>
        {events.map((event: any) => (
          <Event key={event.name} {...event} onEmit={this.onEmit} />
        ))}
      </Wrapper>
    ) : null;
  }
}
