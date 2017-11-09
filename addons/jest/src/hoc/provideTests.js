import React from 'react';

const provideTests = Component => {
  class TestProvider extends React.Component {
    constructor(props) {
      super(props);

      this.state = {};
      this.onAddTests = this.onAddTests.bind(this);
    }

    componentDidMount() {
      this.stopListeningOnStory = this.props.api.onStory((kind, storyName) => {
        this.onAddTests({});
      });

      this.props.channel.on('storybook/tests/add_tests', this.onAddTests);
    }

    onAddTests({ kind, storyName, tests }) {
      this.setState({ kind, storyName, tests });
    }

    componentWillUnmount() {
      if (this.stopListeningOnStory) {
        this.stopListeningOnStory();
      }
      this.props.channel.removeListener('storybook/tests/add_tests', this.onAddTests);
    }

    render() {
      return <Component {...this.state} />;
    }
  }

  return TestProvider;
};

export default provideTests;
