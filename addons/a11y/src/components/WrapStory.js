import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import axe from 'axe-core';

class WrapStory extends Component {
  static propTypes = {
    context: PropTypes.object,
    storyFn: PropTypes.func,
    channel: PropTypes.object,
  }

  componentDidMount() {
    const { channel } = this.props;
    const wrapper = findDOMNode(this);

    if (wrapper !== null) {
      axe.a11yCheck(wrapper, {}, (results) => {
        channel.emit('addon:a11y:check', results);
      });
    }
  }

  render() {
    const { storyFn, context } = this.props;

    return storyFn(context);
  }
}

export default WrapStory;
