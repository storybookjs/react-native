import React, { Component } from 'react';
import json from 'format-json';
import PropTypes from 'prop-types';
import EventEmitter from 'eventemitter3';
import uuid from 'uuid/v4';

const styles = {
  wrapper: {
    padding: 20,
    fontFamily: `
      -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",
      "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif
    `,
    color: 'rgb(51, 51, 51)',
  },
  title: {
    margin: 0,
  },
  item: {
    listStyle: 'none',
    marginBottom: 10,
  },
};

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
    this.props.emitter.on(Logger.LOG_EVENT, this.onEventHandler);
  }

  componentWillUnmount() {
    this.props.emitter.removeListener(Logger.LOG_EVENT, this.onEventHandler);
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
      <div style={styles.wrapper}>
        <h1 style={styles.title}>{title}</h1>
        <dl>
          {events.map(({ id, name, payload }) => (
            <div style={styles.item} key={id}>
              <dt>
                <b>Event name:</b> {name}
              </dt>
              <dd>
                <b>Event payload:</b> {json.plain(payload)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
}
