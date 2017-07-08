import React, { Component } from 'react';
import json from 'format-json';
import PropTypes from 'prop-types';
import EventEmiter from 'eventemitter3';

import uuid from 'uuid/v4';

const EVENTS = {
  TEST_EVENT_1: 'test-event-1',
  TEST_EVENT_2: 'test-event-2',
  TEST_EVENT_3: 'test-event-3',
  TEST_EVENT_4: 'test-event-4',
};

const styles = {
  wrapper: {
    padding: 20,
    fontFamily: `
      -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",
      "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif
    `,
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
      events: [...events, { name, id: uuid(), payload }],
    }));
  };

  render() {
    const { events } = this.state;

    return (
      <div style={styles.wrapper}>
        <h1>Logger</h1>
        <dl>
          {events.map(({ id, name, payload }) =>
            <div style={styles.item} key={id}>
              <dt>
                <b>Event name:</b> {name}
              </dt>
              <dd>
                <b>Event payload:</b> {json.plain(payload)}
              </dd>
            </div>
          )}
        </dl>
      </div>
    );
  }
}
