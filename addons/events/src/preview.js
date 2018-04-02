import { Component } from 'react';
import addons from '@storybook/addons';
import PropTypes from 'prop-types';

import { EVENTS } from './constants';

export default class WithEvents extends Component {
  static propTypes = {
    emit: PropTypes.func.isRequired,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string,
        payload: PropTypes.any,
      })
    ).isRequired,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
  };

  componentDidMount() {
    const { events } = this.props;

    this.channel = addons.getChannel();

    this.channel.on(EVENTS.EMIT, this.onEmit);

    this.channel.emit(EVENTS.ADD, events);
  }

  componentDidUpdate() {
    const { events } = this.props;

    this.channel.emit(EVENTS.ADD, events);
  }

  componentWillUnmount() {
    this.channel.removeListener(EVENTS.EMIT, this.onEmit);
  }

  onEmit = event => {
    this.props.emit(event.name, event.payload);
  };

  render() {
    return this.props.children;
  }
}
