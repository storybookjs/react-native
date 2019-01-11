import React from 'react';
import PropTypes from 'prop-types';
import { STORY_CHANGED } from '@storybook/core-events';
import { ADD_TESTS } from '../shared';

const provideTests = Component =>
  class TestProvider extends React.Component {
    static propTypes = {
      channel: PropTypes.shape({
        on: PropTypes.func,
        removeListener: PropTypes.func,
      }).isRequired,
      api: PropTypes.shape({
        on: PropTypes.func,
      }).isRequired,
      active: PropTypes.bool,
    };

    static defaultProps = {
      active: false,
    };

    state = {};

    componentDidMount() {
      this.mounted = true;
      const { channel, api } = this.props;

      this.stopListeningOnStory = api.on(STORY_CHANGED, () => {
        const { kind, storyName, tests } = this.state;
        if (this.mounted && (kind || storyName || tests)) {
          this.onAddTests({});
        }
      });

      channel.on(ADD_TESTS, this.onAddTests);
    }

    componentWillUnmount() {
      this.mounted = false;
      const { channel } = this.props;

      this.stopListeningOnStory();
      channel.removeListener(ADD_TESTS, this.onAddTests);
    }

    onAddTests = ({ kind, storyName, tests }) => {
      this.setState({ kind, storyName, tests });
    };

    render() {
      const { active } = this.props;
      const { tests } = this.state;

      return active && tests ? <Component {...this.state} /> : null;
    }
  };

export default provideTests;
