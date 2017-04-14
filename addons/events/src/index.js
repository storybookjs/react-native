import { Component, PropTypes } from 'react';
import addons from '@kadira/storybook-addons';

export default class WithEvents extends Component {
  static propTypes = {
    emit: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
  };

  componentDidMount() {
    const { emit, children, ...events } = this.props;

    this.channel = addons.getChannel();

    this.channel.on('z4o4z/events/emit', this.onEmit);

    this.channel.emit('z4o4z/events/add', Object.values(events));
  }

  componentWillReceiveProps(nextProps) {
    const { emit, children, ...events } = nextProps;

    this.channel.emit('z4o4z/events/add', Object.values(events));
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.channel.removeListener('z4o4z/events/emit');
  }

  onEmit = (event) => {
    this.props.emit(event.name, event.payload);
  };

  render() {
    return this.props.children;
  }
}
