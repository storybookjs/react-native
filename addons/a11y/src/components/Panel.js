import React, { Component } from 'react';
import addons from '@storybook/addons';

import { CHECK_EVENT_ID } from '../shared';

import Tabs from './Tabs';
import Report from './Report';

const styles = {
  passes: {
    color: '#0D6731',
  },
  violations: {
    color: '#AC2300',
  },
};

class Panel extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = {
      passes: [],
      violations: [],
    };
    this.channel = addons.getChannel();

    this.onUpdate = this.onUpdate.bind(this);
  }

  componentDidMount() {
    this.channel.on(CHECK_EVENT_ID, this.onUpdate);
  }

  componentWillUnmount() {
    this.channel.removeListener(CHECK_EVENT_ID, this.onUpdate);
  }

  onUpdate({ passes, violations }) {
    this.setState({
      passes,
      violations,
    });
  }

  render() {
    const { passes, violations } = this.state;

    return (
      <Tabs
        tabs={[
          {
            label: <span style={styles.violations}>{violations.length} Violations</span>,
            panel: <Report passes={false} items={violations} empty="No a11y violations found." />,
          },
          {
            label: <span style={styles.passes}>{passes.length} Passes</span>,
            panel: <Report passes items={passes} empty="No a11y check passed" />,
          },
        ]}
      />
    );
  }
}

export default Panel;
