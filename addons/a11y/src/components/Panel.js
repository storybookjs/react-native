import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import styled from '@emotion/styled';

import { STORY_RENDERED } from '@storybook/core-events';
import { ActionBar, ActionButton } from '@storybook/components';

import { CHECK_EVENT_ID, RERUN_EVENT_ID, REQUEST_CHECK_EVENT_ID } from '../shared';

import Tabs from './Tabs';
import Report from './Report';

const Passes = styled.span(({ theme }) => ({
  color: theme.successColor,
}));

const Violations = styled.span(({ theme }) => ({
  color: theme.failColor,
}));

class A11YPanel extends Component {
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
    const { channel } = this.props;

    channel.on(CHECK_EVENT_ID, this.onUpdate);
    channel.on(STORY_RENDERED, this.requestCheck);
    channel.on(RERUN_EVENT_ID, this.requestCheck);
  }

  componentDidUpdate(prevProps) {
    const { active } = this.props;

    if (!prevProps.active && active) {
      this.requestCheck();
    }
  }

  componentWillUnmount() {
    const { channel } = this.props;

    channel.removeListener(CHECK_EVENT_ID, this.onUpdate);
    channel.removeListener(STORY_RENDERED, this.requestCheck);
    channel.removeListener(RERUN_EVENT_ID, this.requestCheck);
  }

  onUpdate = ({ passes, violations }) => {
    this.setState({
      passes,
      violations,
    });
  };

  requestCheck = () => {
    const { channel, active } = this.props;

    if (active) {
      channel.emit(REQUEST_CHECK_EVENT_ID);
    }
  };

  render() {
    const { passes, violations } = this.state;
    const { active } = this.props;

    return active ? (
      <Fragment>
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
        <ActionBar>
          <ActionButton onClick={this.requestCheck}>RERUN TEST</ActionButton>
        </ActionBar>
      </Fragment>
    ) : null;
  }
}

export default A11YPanel;
