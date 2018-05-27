import React from 'react';
import PropTypes from 'prop-types';
import addons from '@storybook/addons';

import styled from 'react-emotion';

const Panel = styled('div')({
  padding: 10,
  boxSizing: 'border-box',
  width: '100%',
});

export class Notes extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { text: '' };
    this.onAddNotes = this.onAddNotes.bind(this);
  }

  componentDidMount() {
    const { channel, api } = this.props;
    // Listen to the notes and render it.
    channel.on('storybook/notes/add_notes', this.onAddNotes);

    // Clear the current notes on every story change.
    this.stopListeningOnStory = api.onStory(() => {
      this.onAddNotes('');
    });
  }

  // This is some cleanup tasks when the Notes panel is unmounting.
  componentWillUnmount() {
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }

    this.unmounted = true;
    const { channel } = this.props;
    channel.removeListener('storybook/notes/add_notes', this.onAddNotes);
  }

  onAddNotes(text) {
    this.setState({ text });
  }

  render() {
    const { text } = this.state;
    const textAfterFormatted = text ? text.trim().replace(/\n/g, '<br />') : '';

    return (
      <Panel
        className="addon-notes-container"
        dangerouslySetInnerHTML={{ __html: textAfterFormatted }}
      />
    );
  }
}

Notes.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  channel: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  api: PropTypes.object,
};
Notes.defaultProps = {
  channel: {},
  api: {},
};

addons.register('storybook/notes', api => {
  const channel = addons.getChannel();
  addons.addPanel('storybook/notes/panel', {
    title: 'Notes',
    // eslint-disable-next-line react/prop-types
    render: ({ active }) => (active ? <Notes channel={channel} api={api} /> : null),
  });
});
