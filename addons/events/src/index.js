import { Component, PropTypes } from 'react';
import addons from '@kadira/storybook-addons';

export default class WithEvents extends Component {
  static propTypes = {
    emit: PropTypes.func.isRequired,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string,
        payload: PropTypes.any,
      }),
    ).isRequired,
    children: PropTypes.element.isRequired,
  };

  componentDidMount() {
    const { events } = this.props;

    this.channel = addons.getChannel();

    this.channel.on('z4o4z/events/emit', this.onEmit);

    this.channel.emit('z4o4z/events/add', events);
  }

  componentWillReceiveProps(nextProps) {
    const { events } = nextProps;

    this.channel.emit('z4o4z/events/add', events);
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.channel.removeListener('z4o4z/events/emit', this.onEmit);
  }

  onEmit = event => {
    this.props.emit(event.name, event.payload);
  };

  render() {
    return this.props.children;
  }
}
