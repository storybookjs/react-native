import React, { Component } from 'react';

export class Clock extends Component {
  state = {
    count: 1,
  };

  componentDidMount() {
    this.timer = window.setInterval(() => {
      const { count } = this.state;
      this.setState({ count: count + 1 });
    }, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  render() {
    const { count } = this.state;

    return <span>{count}</span>;
  }
}
