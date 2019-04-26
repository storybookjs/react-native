import React from 'react';
import { STORY_CHANGED } from '@storybook/core-events';
import { API } from '@storybook/api';
import { ADD_TESTS } from '../shared';

// TODO: import type from @types/jest
interface AssertionResult {
  status: string;
  fullName: string;
  title: string;
  failureMessages: string[];
}

export interface Test {
  name: string;
  result: {
    status: string;
    assertionResults: AssertionResult[];
  };
}

interface InjectedProps {
  tests?: Test[];
}

export interface HocProps {
  api: API;
  active?: boolean;
}

export interface HocState {
  kind?: string;
  storyName?: string;
  tests?: Test[];
}

const provideTests = (Component: React.ComponentType<InjectedProps>) =>
  class TestProvider extends React.Component<HocProps, HocState> {
    static defaultProps = {
      active: false,
    };

    state: HocState = {};

    componentDidMount() {
      this.mounted = true;
      const { api } = this.props;

      this.stopListeningOnStory = api.on(STORY_CHANGED, () => {
        const { kind, storyName, tests } = this.state;
        if (this.mounted && (kind || storyName || tests)) {
          this.onAddTests({});
        }
      });

      api.on(ADD_TESTS, this.onAddTests);
    }

    componentWillUnmount() {
      this.mounted = false;
      const { api } = this.props;

      this.stopListeningOnStory();
      api.off(ADD_TESTS, this.onAddTests);
    }

    onAddTests = ({ kind, storyName, tests }: HocState) => {
      this.setState({ kind, storyName, tests });
    };

    stopListeningOnStory: () => void;

    mounted: boolean;

    render() {
      const { active } = this.props;
      const { tests } = this.state;

      return active && tests ? <Component tests={tests} /> : null;
    }
  };

export default provideTests;
