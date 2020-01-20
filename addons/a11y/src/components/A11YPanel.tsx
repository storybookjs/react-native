/* eslint-disable react/destructuring-assignment,default-case,consistent-return,no-case-declarations */
import React, { Component, Fragment } from 'react';

import { styled } from '@storybook/theming';

import { ActionBar, Icons, ScrollArea } from '@storybook/components';

import { AxeResults, Result } from 'axe-core';
import { API } from '@storybook/api';
import { Provider } from 'react-redux';
import { Report } from './Report';
import { Tabs } from './Tabs';
import { EVENTS } from '../constants';

import store, { clearElements } from '../redux-config';

export enum RuleType {
  VIOLATION,
  PASS,
  INCOMPLETION,
}

const Icon = styled(Icons)({
  height: 12,
  width: 12,
  marginRight: 4,
});

const RotatingIcon = styled(Icon)(({ theme }) => ({
  animation: `${theme.animation.rotate360} 1s linear infinite;`,
}));

const Passes = styled.span<{}>(({ theme }) => ({
  color: theme.color.positive,
}));

const Violations = styled.span<{}>(({ theme }) => ({
  color: theme.color.negative,
}));

const Incomplete = styled.span<{}>(({ theme }) => ({
  color: theme.color.warning,
}));

const Centered = styled.span<{}>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

interface InitialState {
  status: 'initial';
}

interface ManualState {
  status: 'manual';
}

interface RunningState {
  status: 'running';
}

interface RanState {
  status: 'ran';
  passes: Result[];
  violations: Result[];
  incomplete: Result[];
}

interface ReadyState {
  status: 'ready';
  passes: Result[];
  violations: Result[];
  incomplete: Result[];
}

interface ErrorState {
  status: 'error';
  error: unknown;
}

type A11YPanelState =
  | InitialState
  | ManualState
  | RunningState
  | RanState
  | ReadyState
  | ErrorState;

interface A11YPanelProps {
  active: boolean;
  api: API;
}

export class A11YPanel extends Component<A11YPanelProps, A11YPanelState> {
  state: A11YPanelState = {
    status: 'initial',
  };

  componentDidMount() {
    const { api } = this.props;

    api.on(EVENTS.RESULT, this.onResult);
    api.on(EVENTS.ERROR, this.onError);
    api.on(EVENTS.MANUAL, this.onManual);
  }

  componentDidUpdate(prevProps: A11YPanelProps) {
    // TODO: might be able to remove this
    const { active } = this.props;

    if (!prevProps.active && active) {
      // removes all elements from the redux map in store from the previous panel
      store.dispatch(clearElements());
    }
  }

  componentWillUnmount() {
    const { api } = this.props;

    api.off(EVENTS.RESULT, this.onResult);
    api.off(EVENTS.ERROR, this.onError);
    api.off(EVENTS.MANUAL, this.onManual);
  }

  onResult = ({ passes, violations, incomplete }: AxeResults) => {
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

  onError = (error: unknown) => {
    this.setState({
      status: 'error',
      error,
    });
  };

  onManual = (manual: boolean) => {
    if (manual) {
      this.setState({
        status: 'manual',
      });
    } else {
      this.request();
    }
  };

  request = () => {
    const { api } = this.props;
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
  };

  render() {
    const { active } = this.props;
    if (!active) return null;

    switch (this.state.status) {
      case 'initial':
        return <Centered>Initializing...</Centered>;
      case 'manual':
        return (
          <Fragment>
            <Centered>Manually run the accessibility scan.</Centered>
            <ActionBar
              key="actionbar"
              actionItems={[{ title: 'Run test', onClick: this.request }]}
            />
          </Fragment>
        );
      case 'running':
        return (
          <Centered>
            <RotatingIcon inline icon="sync" /> Please wait while the accessibility scan is running
            ...
          </Centered>
        );
      case 'ready':
      case 'ran':
        const { passes, violations, incomplete, status } = this.state;
        const actionTitle =
          status === 'ready' ? (
            'Rerun tests'
          ) : (
            <Fragment>
              <Icon inline icon="check" /> Tests completed
            </Fragment>
          );
        return (
          <Provider store={store}>
            <ScrollArea vertical horizontal>
              <Tabs
                key="tabs"
                tabs={[
                  {
                    label: <Violations>{violations.length} Violations</Violations>,
                    panel: (
                      <Report
                        items={violations}
                        type={RuleType.VIOLATION}
                        empty="No accessibility violations found."
                      />
                    ),
                    items: violations,
                    type: RuleType.VIOLATION,
                  },
                  {
                    label: <Passes>{passes.length} Passes</Passes>,
                    panel: (
                      <Report
                        items={passes}
                        type={RuleType.PASS}
                        empty="No accessibility checks passed."
                      />
                    ),
                    items: passes,
                    type: RuleType.PASS,
                  },
                  {
                    label: <Incomplete>{incomplete.length} Incomplete</Incomplete>,
                    panel: (
                      <Report
                        items={incomplete}
                        type={RuleType.INCOMPLETION}
                        empty="No accessibility checks incomplete."
                      />
                    ),
                    items: incomplete,
                    type: RuleType.INCOMPLETION,
                  },
                ]}
              />
            </ScrollArea>
            <ActionBar
              key="actionbar"
              actionItems={[{ title: actionTitle, onClick: this.request }]}
            />
          </Provider>
        );
      case 'error':
        const { error } = this.state;
        return (
          <Centered>
            The accessibility scan encountered an error.
            <br />
            {error}
          </Centered>
        );
    }
  }
}
