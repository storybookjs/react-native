import React from 'react';
import PropTypes from 'prop-types';

const provideTests = Component =>
  class TestProvider extends React.Component {
    static propTypes = {
      channel: PropTypes.shape({
        on: PropTypes.func,
        removeListener: PropTypes.func,
      }).isRequired,
      api: PropTypes.shape({
        onStory: PropTypes.func,
      }).isRequired,
      active: PropTypes.bool,
    };

    static defaultProps = {
      active: true,
    };

    state = {};

    componentDidMount() {
      const { channel, api } = this.props;

      this.stopListeningOnStory = api.onStory(() => {
        this.onAddTests({});
      });

      channel.on('storybook/tests/add_tests', this.onAddTests);
    }

    componentWillUnmount() {
      const { channel } = this.props;

      if (this.stopListeningOnStory) {
        this.stopListeningOnStory();
      }
      channel.removeListener('storybook/tests/add_tests', this.onAddTests);
    }

    onAddTests = ({ kind, storyName, tests }) => {
      this.setState({ kind, storyName, tests });
    };

    render() {
      const { active } = this.props;
      return active ? <Component {...this.state} /> : null;
    }
  };

export default provideTests;
