import React, { Component, Fragment } from 'react';

import { styled } from '@storybook/theming';

import { STORY_RENDERED } from '@storybook/core-events';
import { ActionBar, Icons, ScrollArea } from '@storybook/components';

import { AxeResults, Result } from 'axe-core';
import { Report } from './Report';
import { Tabs } from './Tabs';
import { EVENTS } from '../constants';
import { API } from '@storybook/api';

import { Provider } from 'react-redux';
import store, { clearElements } from '../redux-config';

export enum RuleType {
  VIOLATION,
  PASS,
  INCOMPLETION,
}

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

const Loader = styled(({ className }) => (
  <div className={className}>
    <Icon inline icon="sync" status="running" /> Please wait while a11y scan is running ...
  </div>
))({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});
Loader.displayName = 'Loader';

interface A11YPanelState {
  status: string;
  passes: Result[];
  violations: Result[];
  incomplete: Result[];
}

interface A11YPanelProps {
  active: boolean;
  api: API;
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
      // removes all elements from the redux map in store from the previous panel
      store.dispatch(clearElements());
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
          // removes all elements from the redux map in store from the previous panel
          store.dispatch(clearElements());
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
        <Provider store={store}>
          {status === 'running' ? (
            <Loader />
          ) : (
            <ScrollArea vertical horizontal>
              <Tabs
                key="tabs"
                tabs={[
                  {
                    label: <Violations>{violations.length} Violations</Violations>,
                    panel: (
                      <Report
                        passes={false}
                        items={violations}
                        type={RuleType.VIOLATION}
                        empty="No a11y violations found."
                      />
                    ),
                    items: violations,
                    type: RuleType.VIOLATION,
                  },
                  {
                    label: <Passes>{passes.length} Passes</Passes>,
                    panel: (
                      <Report
                        passes
                        items={passes}
                        type={RuleType.PASS}
                        empty="No a11y check passed."
                      />
                    ),
                    items: passes,
                    type: RuleType.PASS,
                  },
                  {
                    label: <Incomplete>{incomplete.length} Incomplete</Incomplete>,
                    panel: (
                      <Report
                        passes={false}
                        items={incomplete}
                        type={RuleType.INCOMPLETION}
                        empty="No a11y incomplete found."
                      />
                    ),
                    items: incomplete,
                    type: RuleType.INCOMPLETION,
                  },
                ]}
              />
            </ScrollArea>
          )}
          <ActionBar
            key="actionbar"
            actionItems={[{ title: actionTitle, onClick: this.request }]}
          />
        </Provider>
      </Fragment>
    ) : null;
  }
}
