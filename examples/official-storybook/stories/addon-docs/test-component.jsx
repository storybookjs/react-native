import React from 'react';

export class TestComponent extends React.PureComponent {
  componentDidMount() {
    console.log('TestComponent did mount');
  }

  componentWillUnmount() {
    console.log('TestComponent will unmount');
  }

  render() {
    return <div>I am a test!</div>;
  }
}
