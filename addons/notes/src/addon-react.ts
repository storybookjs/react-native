import * as React from 'react';
import addons from '@storybook/addons';

interface WithNotesProps {
  notes: string;
}

export class WithNotes extends React.Component<WithNotesProps> {
  static defaultProps: WithNotesProps = {
    notes: '',
    // todo might need to add children: null and type that
  };

  render() {
    const { children, notes } = this.props;
    const channel = addons.getChannel();

    channel.emit('storybook/notes/add_notes', notes);

    return children;
  }
}
