import React from 'react';
import PropTypes from 'prop-types';
import addons from '@storybook/addons';

export class WithNotes extends React.Component {
  render() {
    const { children, notes } = this.props;
    const channel = addons.getChannel();

    // send the notes to the channel.
    channel.emit('storybook/notes/add_notes', notes);
    // return children elements.
    return children;
  }
}

WithNotes.propTypes = {
  children: PropTypes.node,
  notes: PropTypes.string,
};
WithNotes.defaultProps = {
  children: null,
  notes: '',
};
