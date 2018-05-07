import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import axe from 'axe-core';
import { logger } from '@storybook/client-logger';

import { CHECK_EVENT_ID, RERUN_EVENT_ID } from '../shared';

class WrapStory extends Component {
  static propTypes = {
    context: PropTypes.shape({}),
    storyFn: PropTypes.func,
    channel: PropTypes.shape({}),
    axeOptions: PropTypes.shape({}),
  };
  static defaultProps = {
    context: {},
    storyFn: () => {},
    channel: {},
    axeOptions: {},
  };

  constructor(props) {
    super(props);
    this.runA11yCheck = this.runA11yCheck.bind(this);
  }

  componentDidMount() {
    const { channel } = this.props;
    channel.on(RERUN_EVENT_ID, this.runA11yCheck);
    this.runA11yCheck();
  }

  componentWillUnmount() {
    const { channel } = this.props;
    channel.removeListener(RERUN_EVENT_ID, this.runA11yCheck);
  }

  /* eslint-disable react/no-find-dom-node */
  runA11yCheck() {
    const { channel, axeOptions } = this.props;
    const wrapper = findDOMNode(this);

    if (wrapper !== null) {
      axe.reset();
      axe.configure(axeOptions);
      axe.run(wrapper).then(results => channel.emit(CHECK_EVENT_ID, results), logger.error);
    }
  }

  render() {
    const { storyFn, context } = this.props;

    return storyFn(context);
  }
}

export default WrapStory;
