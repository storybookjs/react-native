import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { styled } from '@storybook/theming';

import { STORY_RENDERED } from '@storybook/core-events';
import { ActionBar, Icons } from '@storybook/components';

import EVENTS from '../constants';

import Tabs from './Tabs';
import Report from './Report';

const Icon = styled(Icons)(
  {
    height: '12px',
    width: '12px',
    marginRight: '4px',
  },
  ({ status, theme }) =>
    status === 'running'
      ? {
          animation: `${theme.animation.rotate360} 1s linear infinite;`,
        }
      : {}
);

const Passes = styled.span(({ theme }) => ({
  color: theme.color.positive,
}));

const Violations = styled.span(({ theme }) => ({
  color: theme.color.negative,
}));

class A11YPanel extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    api: PropTypes.shape({
      on: PropTypes.func,
      emit: PropTypes.func,
      off: PropTypes.func,
    }).isRequired,
  };

  state = {
    status: 'ready',
    passes: [],
    violations: [],
  };

  componentDidMount() {
    const { api } = this.props;

    api.on(STORY_RENDERED, this.request);
    api.on(EVENTS.RESULT, this.onUpdate);
  }

  componentDidUpdate(prevProps) {
    // TODO: might be able to remove this
    const { active } = this.props;

    if (!prevProps.active && active) {
      this.request();
    }
  }

  componentWillUnmount() {
    const { api } = this.props;

    api.off(STORY_RENDERED, this.request);
    api.off(EVENTS.RESULT, this.onUpdate);
  }

  onUpdate = ({ passes, violations }) => {
    this.setState(
      {
        status: 'ran',
        passes,
        violations,
      },
      () => {
        setTimeout(() => {
          const { status } = this.state;
          if (status === 'ran') {
            this.setState({
              status: 'ready',
            });
          }
        }, 900);
      }
    );
  };

  request = () => {
    const { api, active } = this.props;

    if (active) {
      this.setState(
        {
          status: 'running',
        },
        () => {
          api.emit(EVENTS.REQUEST);
        }
      );
    }
  };

  render() {
    const { passes, violations, status } = this.state;
    const { active } = this.props;

    let actionTitle;
    if (status === 'ready') {
      actionTitle = 'Rerun tests';
    } else if (status === 'running') {
      actionTitle = (
        <Fragment>
          <Icon inline icon="sync" status={status} /> Running test
        </Fragment>
      );
    } else if (status === 'ran') {
      actionTitle = (
        <Fragment>
          <Icon inline icon="check" /> Tests completed
        </Fragment>
      );
    }

    return active ? (
      <Fragment>
        <Tabs
          key="tabs"
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
        <ActionBar key="actionbar" actionItems={[{ title: actionTitle, onClick: this.request }]} />
      </Fragment>
    ) : null;
  }
}

export default A11YPanel;
