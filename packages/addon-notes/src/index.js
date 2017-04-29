import React, { PropTypes } from 'react';
import addons from '@kadira/storybook-addons';

export class WithNotes extends React.Component {
  render() {
    const { children, notes } = this.props;
    const channel = addons.getChannel();

    // send the notes to the channel.
    channel.emit('kadira/notes/add_notes', notes);
    // return children elements.
    return children;
  }
}

WithNotes.defaultProps = {
  children: null,
  notes: '',
};

WithNotes.propTypes = {
  children: PropTypes.node,
  notes: PropTypes.string,
};
