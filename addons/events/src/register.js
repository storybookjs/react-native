import React, { PropTypes, Component } from 'react';
import addons from '@storybook/addons';

import Item from './components/Item';

const styles = {
  wrapper: {
    margin: 10,
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    width: '100%',
    color: 'rgb(51, 51, 51)',
    overflow: 'auto',
  },
};

export default class Events extends Component {
  static propTypes = {
    api: PropTypes.shape({
      onStory: PropTypes.func,
    }).isRequired,
    channel: PropTypes.shape({
      on: PropTypes.func,
      emit: PropTypes.func,
      removeListener: PropTypes.func,
    }).isRequired,
  };

  state = {
    events: [],
  };

  componentDidMount() {
    this.props.channel.on('z4o4z/events/add', this.onAdd);

    this.stopListeningOnStory = this.props.api.onStory(() => {
      this.onAdd([]);
    });
  }

  componentWillUnmount() {
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }

    this.unmounted = true;
    this.props.channel.removeListener('z4o4z/events/add', this.onAdd);
  }

  onAdd = events => {
    this.setState({ events });
  };

  onEmit = event => {
    this.props.channel.emit('z4o4z/events/emit', event);
  };

  render() {
    return (
      <div style={styles.wrapper}>
        {this.state.events.map((event, i) => <Item key={i} {...event} onEmit={this.onEmit} />)}
      </div>
    );
  }
}

addons.register('z4o4z/events', api => {
  addons.addPanel('z4o4z/events/panel', {
    title: 'Events',
    render: () => <Events channel={addons.getChannel()} api={api} />,
  });
});
