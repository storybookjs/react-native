import React from 'react';
import PropTypes from 'prop-types';
import addons from '@storybook/addons';
import { SET_STORY_DEFAULT_VIEWPORT_EVENT_ID, DEFAULT_VIEWPORT } from '../../shared';

export default class Viewport extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    name: DEFAULT_VIEWPORT,
  };

  constructor(props) {
    super(props);

    this.channel = addons.getChannel();
  }

  componentWillMount() {
    this.channel.emit(SET_STORY_DEFAULT_VIEWPORT_EVENT_ID, this.props.name);
  }

  componentWillUnmount() {}

  render() {
    return this.props.children;
  }
}
