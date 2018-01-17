import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DelayedRender extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };
  state = {
    show: false,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        show: true,
      });
    }, 1000);
  }
  render() {
    return this.state.show ? this.props.children : <div />;
  }
}
