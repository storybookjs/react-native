import React, { Component } from 'react';
import addons from '@storybook/addons';

import Tabs from './Tabs';
import Report from './Report';

const styles = {
  passes: {
    color: '#2ecc71',
  },
  violations: {
    color: '#e74c3c',
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
    this.channel.on('addon:a11y:check', this.onUpdate);
  }

  componentWillUnmount() {
    this.channel.removeListener('addon:a11y:check', this.onUpdate);
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
            label: <span style={styles.violations}>Violations</span>,
            panel: <Report passes={false} items={violations} empty="No a11y violations found." />,
          },
          {
            label: <span style={styles.passes}>Passes</span>,
            panel: <Report passes items={passes} empty="No a11y check passed" />,
          },
        ]}
      />
    );
  }
}

export default Panel;
