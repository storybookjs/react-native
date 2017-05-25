/* eslint-disable import/no-extraneous-dependencies*/
import React, { Component, PropTypes } from 'react';
import EventEmiter from 'eventemitter3';
/* eslint-enable import/no-extraneous-dependencies*/
import json from 'format-json';

import * as EVENTS from './events';

const styles = {
  wrapper: {
    padding: 20,
    fontFamily: 'Areal, sans-serif',
    color: 'rgb(51, 51, 51)',
  },
  item: {
    listStyle: 'none',
    marginBottom: 10,
  },
};

export default class Logger extends Component {
  static propTypes = {
    emiter: PropTypes.instanceOf(EventEmiter).isRequired,
  };

  state = {
    events: [],
  };

  componentWillMount() {
    const { emiter } = this.props;

    emiter.on(EVENTS.TEST_EVENT_1, this.onEventHandler(EVENTS.TEST_EVENT_1));
    emiter.on(EVENTS.TEST_EVENT_2, this.onEventHandler(EVENTS.TEST_EVENT_2));
    emiter.on(EVENTS.TEST_EVENT_3, this.onEventHandler(EVENTS.TEST_EVENT_3));
    emiter.on(EVENTS.TEST_EVENT_4, this.onEventHandler(EVENTS.TEST_EVENT_4));
  }

  onEventHandler = name => payload => {
    this.setState(({ events }) => ({
      events: [...events, { name, payload }],
    }));
  };

  render() {
    return (
      <div style={styles.wrapper}>
        <h1>Logger</h1>
        <dl>
          {this.state.events.map((event, i) => (
            <div style={styles.item} key={i}>
              <dt><b>Event name:</b> {event.name}</dt>
              <dd><b>Event payload:</b> {json.plain(event.payload)}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
}
