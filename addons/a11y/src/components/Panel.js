import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion';

import { CHECK_EVENT_ID } from '../shared';

import Tabs from './Tabs';
import Report from './Report';

const Passes = styled('span')({
  color: '#0D6731',
});

const Violations = styled('span')({
  color: '#AC2300',
});

class Panel extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    channel: PropTypes.shape({
      on: PropTypes.func,
      emit: PropTypes.func,
      removeListener: PropTypes.func,
    }).isRequired,
  };

  state = {
    passes: [],
    violations: [],
  };

  componentDidMount() {
    this.props.channel.on(CHECK_EVENT_ID, this.onUpdate);
  }

  componentWillUnmount() {
    this.props.channel.removeListener(CHECK_EVENT_ID, this.onUpdate);
  }

  onUpdate = ({ passes, violations }) => {
    this.setState({
      passes,
      violations,
    });
  };

  render() {
    const { passes, violations } = this.state;
    const { active } = this.props;

    return active ? (
      <Tabs
        tabs={[
          {
            label: <Violations>{violations.length} Violations</Violations>,
            panel: <Report passes={false} items={violations} empty="No a11y violations found." />,
          },
          {
            label: <Passes>{passes.length} Passes</Passes>,
            panel: <Report passes items={passes} empty="No a11y check passed" />,
          },
        ]}
      />
    ) : null;
  }
}

export default Panel;
