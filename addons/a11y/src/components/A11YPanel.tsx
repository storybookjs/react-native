import React, { Component, Fragment } from 'react';

import { styled } from '@storybook/theming';

import { STORY_RENDERED } from '@storybook/core-events';
import { ActionBar, Icons, ScrollArea } from '@storybook/components';

import { AxeResults, Result } from 'axe-core';
import { Report } from './Report';
import { Tabs } from './Tabs';
import { EVENTS } from '../constants';

const Icon = styled(Icons)(
  {
    height: '12px',
    width: '12px',
    marginRight: '4px',
  },
  ({ status, theme }: any) =>
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

const Incomplete = styled.span(({ theme }) => ({
  color: theme.color.warning,
}));

interface A11YPanelState {
  status: string;
  passes: Result[];
  violations: Result[];
  incomplete: Result[];
}

interface A11YPanelProps {
  active: boolean;
  api: {
    on(event: string, callback: (data: any) => void): void;
    off(event: string, callback: (data: any) => void): void;
    emit(event: string): void;
  };
}

export class A11YPanel extends Component<A11YPanelProps, A11YPanelState> {
  state: A11YPanelState = {
    status: 'ready',
    passes: [],
    violations: [],
    incomplete: [],
  };

  componentDidMount() {
    const { api } = this.props;

    api.on(STORY_RENDERED, this.request);
    api.on(EVENTS.RESULT, this.onUpdate);
  }

  componentDidUpdate(prevProps: A11YPanelProps) {
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

  onUpdate = ({ passes, violations, incomplete }: AxeResults) => {
    this.setState(
      {
        status: 'ran',
        passes,
        violations,
        incomplete,
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
    const { passes, violations, incomplete, status } = this.state;
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
        <ScrollArea vertical horizontal>
          <Tabs
            key="tabs"
            tabs={[
              {
                label: <Violations>{violations.length} Violations</Violations>,
                panel: (
                  <Report passes={false} items={violations} empty="No a11y violations found." />
                ),
              },
              {
                label: <Passes>{passes.length} Passes</Passes>,
                panel: <Report passes items={passes} empty="No a11y check passed." />,
              },
              {
                label: <Incomplete>{incomplete.length} Incomplete</Incomplete>,
                panel: (
                  <Report passes={false} items={incomplete} empty="No a11y incomplete found." />
                ),
              },
            ]}
          />
        </ScrollArea>
        <ActionBar key="actionbar" actionItems={[{ title: actionTitle, onClick: this.request }]} />
      </Fragment>
    ) : null;
  }
}
