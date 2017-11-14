import React from 'react';
import PropTypes from 'prop-types';

const provideTests = Component => {
  class TestProvider extends React.Component {
    static propTypes = {
      channel: PropTypes.shape({
        on: PropTypes.func,
        removeListener: PropTypes.func,
      }).isRequired,
      api: PropTypes.shape({
        onStory: PropTypes.func,
      }).isRequired,
    };

    constructor(props) {
      super(props);

      this.state = {};
      this.onAddTests = this.onAddTests.bind(this);
    }

    componentDidMount() {
      this.stopListeningOnStory = this.props.api.onStory(() => {
        this.onAddTests({});
      });

      this.props.channel.on('storybook/tests/add_tests', this.onAddTests);
    }

    componentWillUnmount() {
      if (this.stopListeningOnStory) {
        this.stopListeningOnStory();
      }
      this.props.channel.removeListener('storybook/tests/add_tests', this.onAddTests);
    }

    onAddTests({ kind, storyName, tests }) {
      this.setState({ kind, storyName, tests });
    }

    render() {
      return <Component {...this.state} />;
    }
  }

  return TestProvider;
};

export default provideTests;
