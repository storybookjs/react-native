import React, { Component, PropTypes } from 'react';
import axe from 'axe-core';

class WrapStory extends Component {
  static propTypes = {
    context: PropTypes.object,
    storyFn: PropTypes.func,
    channel: PropTypes.object,
  }

  componentDidMount() {
    const { channel } = this.props;

    axe.a11yCheck(this.wrapper, {}, (results) => {
      channel.emit('addon:a11y:check', results);
    });
  }

  render() {
    const { storyFn, context } = this.props;

    return (<span
        ref={ (container) => { this.wrapper = container; } }
      >
        {storyFn(context)}
      </span>)
  }
}

export default WrapStory;
