import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Markdown from 'react-native-simple-markdown';
import addons from '@storybook/addons';

export class Notes extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { text: '' };
    this.onAddNotes = this.onAddNotes.bind(this);
  }

  componentDidMount() {
    const { channel } = this.props;
    // Listen to the notes and render it.
    channel.on('storybook/notes/add_notes', this.onAddNotes);
  }

  // This is some cleanup tasks when the Notes panel is unmounting.
  componentWillUnmount() {
    this.unmounted = true;
    const { channel } = this.props;
    channel.removeListener('storybook/notes/add_notes', this.onAddNotes);
  }

  onAddNotes(text) {
    this.setState({ text });
  }

  render() {
    const { active } = this.props;
    const { text } = this.state;
    const textAfterFormatted = text ? text.trim() : '';

    return active ? (
      <View style={{ padding: 10, flex: 1 }}>
        <Markdown>{textAfterFormatted}</Markdown>
      </View>
    ) : null;
  }
}

Notes.propTypes = {
  active: PropTypes.bool.isRequired,
  channel: PropTypes.shape({
    on: PropTypes.func,
    emit: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    on: PropTypes.func,
    getQueryParam: PropTypes.func,
    setQueryParams: PropTypes.func,
  }).isRequired,
};

addons.register('storybook/notes', api => {
  const channel = addons.getChannel();
  addons.addPanel('storybook/notes/panel', {
    title: 'Notes',
    // eslint-disable-next-line react/prop-types
    render: ({ active, key }) => <Notes key={key} channel={channel} api={api} active={active} />,
  });
});
