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
    this.showTO = setTimeout(() => {
      this.setState({
        show: true,
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.showTO);
  }

  render() {
    const { show } = this.state;
    const { children } = this.props;
    return show ? children : <div />;
  }
}
