import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion';

import { STORY_RENDERED } from '@storybook/core-events';

import { CHECK_EVENT_ID, RERUN_EVENT_ID, REQUEST_CHECK_EVENT_ID } from '../shared';

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
    this.props.channel.on(STORY_RENDERED, this.requestCheck);
    this.props.channel.on(RERUN_EVENT_ID, this.requestCheck);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.active && this.props.active) {
      this.requestCheck();
    }
  }

  componentWillUnmount() {
    this.props.channel.removeListener(CHECK_EVENT_ID, this.onUpdate);
    this.props.channel.removeListener(STORY_RENDERED, this.requestCheck);
    this.props.channel.removeListener(RERUN_EVENT_ID, this.requestCheck);
  }

  onUpdate = ({ passes, violations }) => {
    this.setState({
      passes,
      violations,
    });
  };

  requestCheck = () => {
    if (this.props.active) {
      this.props.channel.emit(REQUEST_CHECK_EVENT_ID);
    }
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
