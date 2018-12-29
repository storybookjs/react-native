import * as React from 'react';

import * as PropTypes from 'prop-types';

import styled from '@emotion/styled';
import { Channel } from '@storybook/channels';
import { addons } from '@storybook/addons';

interface NotesApi {
  setQueryParams: any; // todo check correct definition
  getQueryParam(queryParamName: string): any;

  onStory(callback: () => void): () => void;
}

interface NotesProps {
  active: boolean;
  channel: Channel;
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
  static propTypes = {
    active: PropTypes.bool.isRequired,
    channel: PropTypes.shape({
      on: PropTypes.func,
      emit: PropTypes.func,
      removeListener: PropTypes.func,
    }).isRequired,
    api: PropTypes.shape({
      onStory: PropTypes.func,
      getQueryParam: PropTypes.func,
      setQueryParams: PropTypes.func,
    }).isRequired,
  };

  stopListeningOnStory: () => void;
  isUnmounted = false;

  readonly state: NotesState = { text: '' };

  constructor(props: NotesProps) {
    super(props);
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

    this.isUnmounted = true;
    const { channel } = this.props;
    channel.removeListener('storybook/notes/add_notes', this.onAddNotes);
  }

  onAddNotes(text: string) {
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

addons.register('storybook/notes', (api: any) => {
  const channel = addons.getChannel();
  addons.addPanel('storybook/notes/panel', {
    title: 'Notes',
    render: ({ active }: { active: boolean }) => (
      <Notes channel={channel} api={api} active={active} />
    ),
  });
});
