import React from 'react';
import PropTypes from 'prop-types';
import addons from '@storybook/addons';
import {
  CONFIGURE_VIEWPORT_EVENT_ID,
  SET_STORY_DEFAULT_VIEWPORT_EVENT_ID,
  UNSET_STORY_DEFAULT_VIEWPORT_EVENT_ID,
} from '../shared';

export { INITIAL_VIEWPORTS, DEFAULT_VIEWPORT } from '../shared';

export function configure(configs = {}) {
  const channel = addons.getChannel();

  if (channel) {
    channel.emit(CONFIGURE_VIEWPORT_EVENT_ID, configs);
  }
}

export function withViewport(name) {
  return getStory => <Viewport name={name}>{getStory()}</Viewport>;
}

export class Viewport extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);

    this.channel = addons.getChannel();
  }

  componentWillMount() {
    this.channel.emit(SET_STORY_DEFAULT_VIEWPORT_EVENT_ID, this.props.name);
  }

  componentWillUnmount() {
    this.channel.emit(UNSET_STORY_DEFAULT_VIEWPORT_EVENT_ID);
  }

  render() {
    return this.props.children;
  }
}
