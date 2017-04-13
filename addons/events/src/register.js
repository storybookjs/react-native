/* eslint-disable jsx-a11y/anchor-has-content,
  jsx-a11y/anchor-has-content,
  jsx-a11y/aria-props,
  jsx-a11y/aria-proptypes,
  jsx-a11y/aria-proptypes,
  jsx-a11y/aria-unsupported-elements,
  jsx-a11y/aria-unsupported-elements,
  jsx-a11y/href-no-hash,
  jsx-a11y/href-no-hash,
  jsx-a11y/img-has-alt,
  jsx-a11y/img-has-alt,
  jsx-a11y/img-redundant-alt,
  jsx-a11y/img-redundant-alt,
  jsx-a11y/label-has-for,
  jsx-a11y/label-has-for,
  jsx-a11y/aria-role,
  jsx-a11y/aria-role,
  jsx-a11y/role-supports-aria-props,
  jsx-a11y/role-supports-aria-props,
  jsx-a11y/tabindex-no-positive,
  jsx-a11y/tabindex-no-positive,
  jsx-a11y/heading-has-content,
  jsx-a11y/heading-has-content,
  jsx-a11y/html-has-lang,
  jsx-a11y/html-has-lang,
  jsx-a11y/lang,
  jsx-a11y/lang,
  jsx-a11y/role-has-required-aria-props,
  jsx-a11y/scope,
  jsx-a11y/no-static-element-interactions
 */

import React, { PropTypes, Component } from 'react';
import addons from '@kadira/storybook-addons';

const styles = {
  wrapper: {
    margin: 10,
    fontFamily: 'Arial',
    fontSize: 14,
    width: '100%',
    overflow: 'auto',
  },
  item: {
    margin: 5,
  },
  button: {
    fontFamily: 'Arial',
    fontSize: 14,
    padding: 10,
    width: '100%',
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

  onAdd = (events) => {
    this.setState({ events });
  };

  render() {
    const { events } = this.state;

    return (
      <div style={styles.wrapper}>
        {events.map((event, index) => (
          <div style={styles.item} key={index}>
            <button
              style={styles.button}
              onClick={() => this.props.channel.emit('z4o4z/events/emit', event)}
            >
              {event.title}
            </button>
          </div>
        ))}
      </div>
    );
  }
}

// Register the addon with a unique name.
addons.register('z4o4z/events', (api) => {
  // Also need to set a unique name to the panel.
  addons.addPanel('z4o4z/events/panel', {
    title: 'Events',
    render: () => <Events channel={addons.getChannel()} api={api} />,
  });
});
