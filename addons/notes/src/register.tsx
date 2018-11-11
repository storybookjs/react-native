import * as React from 'react';
import addons from '@storybook/addons';

import styled from '@emotion/styled';

interface NotesChannel {
  on: (listener: string, callback: (text: string) => void) => any; // todo check correct return value definition
  emit: any; // todo check correct definition
  removeListener: (listener: string, callback: (text: string) => void) => void;
}

interface NotesApi {
  onStory: (callback: () => void) => void;
  getQueryParam: any; // todo check correct definition
  setQueryParams: any; // todo check correct definition
}

interface NotesProps {
  active: boolean;
  channel: NotesChannel;
  api: NotesApi;
}

interface NotesState {
  text: string;
}

const Panel = styled.div({
  padding: 10,
  boxSizing: 'border-box',
  width: '100%',
});

export class Notes extends React.Component<NotesProps, NotesState> {

  // todo check how react typescript does this, especially unmounted
  stopListeningOnStory: any; // todo check correct definition
  unmounted: any; // todo check correct definition

  constructor(...args: any) {
    super(args /* todo: This was ...args before, check if this was a bug */);
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
    const { active } = this.props;
    const { text } = this.state;
    const textAfterFormatted = text
      ? text
        .trim()
        .replace(/(<\S+.*>)\n/g, '$1')
        .replace(/\n/g, '<br />')
      : '';

    return active ? (
      <Panel
        className="addon-notes-container"
        dangerouslySetInnerHTML={{ __html: textAfterFormatted }}
      />
    ) : null;
  }
}


addons.register('storybook/notes', api => {
  const channel = addons.getChannel();
  addons.addPanel('storybook/notes/panel', {
    title: 'Notes',
    render: ({ active }) => <Notes channel={channel} api={api} active={active} />,
  });
});
