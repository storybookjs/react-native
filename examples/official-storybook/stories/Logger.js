import React, { Component } from 'react';
import json from 'format-json';
import PropTypes from 'prop-types';

import { styled } from '@storybook/theming';
import EventEmitter from 'eventemitter3';
import uuid from 'uuid/v4';

const Wrapper = styled.div({
  padding: 20,
});
const Title = styled.h1({
  margin: 0,
});
const Item = styled.div({
  listStyle: 'none',
  marginBottom: 10,
});

export default class Logger extends Component {
  static LOG_EVENT = 'Logger:log';

  static propTypes = {
    emitter: PropTypes.instanceOf(EventEmitter).isRequired,
    title: PropTypes.string,
  };

  static defaultProps = {
    title: 'Logger',
  };

  state = {
    events: [],
  };

  componentDidMount() {
    const { emitter } = this.props;

    emitter.on(Logger.LOG_EVENT, this.onEventHandler);
  }

  componentWillUnmount() {
    const { emitter } = this.props;

    emitter.removeListener(Logger.LOG_EVENT, this.onEventHandler);
  }

  onEventHandler = ({ name, payload }) => {
    this.setState(({ events }) => ({
      events: [...events, { name, id: uuid(), payload }],
    }));
  };

  render() {
    const { events } = this.state;
    const { title } = this.props;

    return (
      <Wrapper>
        <Title>{title}</Title>
        <dl>
          {events.map(({ id, name, payload }) => (
            <Item key={id}>
              <dt>
                <b>Event name:</b> {name}
              </dt>
              <dd>
                <b>Event payload:</b> {json.plain(payload)}
              </dd>
            </Item>
          ))}
        </dl>
      </Wrapper>
    );
  }
}
