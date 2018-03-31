import React from 'react';
import PropTypes from 'prop-types';
import addons from '@storybook/addons';
import {
  SET_STORY_DEFAULT_VIEWPORT_EVENT_ID,
  VIEWPORT_CHANGED_EVENT_ID,
  DEFAULT_VIEWPORT,
} from '../../shared';

const noop = () => {};

export default class Viewport extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    children: PropTypes.node.isRequired,
    onViewportChange: PropTypes.func,
  };

  static defaultProps = {
    name: DEFAULT_VIEWPORT,
    onViewportChange: noop,
  };

  constructor(props) {
    super(props);

    this.channel = addons.getChannel();
    const { onViewportChange } = props;

    if (typeof this.props.onViewportChange === 'function') {
      this.onViewportChange = onViewportChange;
    }
  }

  componentDidMount() {
    if (this.onViewportChange) {
      this.channel.on(VIEWPORT_CHANGED_EVENT_ID, this.onViewportChange);
    }

    this.channel.emit(SET_STORY_DEFAULT_VIEWPORT_EVENT_ID, this.props.name);
  }

  componentWillUnmount() {
    if (this.onViewportChange) {
      this.channel.removeListener(VIEWPORT_CHANGED_EVENT_ID, this.onViewportChange);
    }
  }

  render() {
    return this.props.children;
  }
}
