import React from 'react';
import addons from '@kadira/storybook-addons';

const styles = {
  notesPanel: {
    margin: 10,
    fontFamily: '-apple-system, ".SFNSText-Regular", "San Francisco", Roboto, "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif',
    fontSize: 14,
    color: '#444',
    width: '100%',
    overflow: 'auto',
  }
};

export class WithNote extends React.Component {
  render() {
    const { children, note } = this.props;
    // This is to make sure, we'll always call this at the end of the eventloop.
    // So we know that, panel will get cleared, before we render the note.
    setTimeout(() => {
      addons.getChannel().emit('kadira/notes/add_note', note);
    }, 0);
    return children;
  }
}

class Notes extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {text: ''};
    this.onAddNote = this.onAddNote.bind(this);
  }

  onAddNote(text) {
    this.setState({text});
  }

  componentDidMount() {
    const { channel, api } = this.props;
    channel.on('kadira/notes/add_note', this.onAddNote);

    this.stopListeningOnStory = api.onStory(() => {
      this.setState({text: ''});
    });
  }

  componentWillUnmount() {
    if(this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }

    this.unmounted = true;
    const { channel, api } = this.props;
    channel.removeListener('kadira/notes/add_note', this.onAddNote);
  }

  render() {
    const { text } = this.state;
    const textAfterFormatted = text? text.trim().replace(/\n/g, '<br />') : "";

    return (
      <div style={styles.notesPanel}>
        <div dangerouslySetInnerHTML={{__html: textAfterFormatted}} />
      </div>
    );
  }
}

export function register() {
  addons.register('kadira/notes', (api) => {
    addons.addPanel('kadira/notes/panel', {
      title: 'Notes',
      render: () => (
        <Notes channel={addons.getChannel()} api={api}/>
      ),
    })
  })
}
