import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import addons from '@storybook/addons';

import { Placeholder } from '@storybook/components';
import { ADDON_ID, PANEL_ID } from './shared';

const Panel = styled.div({
  padding: 10,
  boxSizing: 'border-box',
  width: '100%',
});

export class NotesPanel extends React.Component {
  state = {
    text: '',
  };

  componentDidMount() {
    this.mounted = true;
    const { channel, api } = this.props;

    // Clear the current notes on every story change.
    this.stopListeningOnStory = api.onStory(() => {
      const { text } = this.state;
      if (this.mounted && text !== '') {
        this.onAddNotes('');
      }
    });
    channel.on('storybook/notes/add_notes', this.onAddNotes);
  }

  componentWillUnmount() {
    this.mounted = false;
    const { channel } = this.props;

    this.stopListeningOnStory();
    channel.removeListener('storybook/notes/add_notes', this.onAddNotes);
  }

  onAddNotes = text => {
    this.setState({ text });
  };

  render() {
    const { active } = this.props;
    const { text } = this.state;
    const textAfterFormatted = text
      ? text
          .trim()
          .replace(/(<\S+.*>)\n/g, '$1')
          .replace(/\n/g, '<br />')
      : '';

    if (!active) {
      return null;
    }

    return textAfterFormatted ? (
      <Panel
        className="addon-notes-container"
        dangerouslySetInnerHTML={{ __html: textAfterFormatted }}
      />
    ) : (
      <Placeholder>There is no info/note</Placeholder>
    );
  }
}

NotesPanel.propTypes = {
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

addons.register(ADDON_ID, api => {
  const channel = addons.getChannel();

  // eslint-disable-next-line react/prop-types
  const render = ({ active }) => <NotesPanel channel={channel} api={api} active={active} />;
  const title = 'Notes';
  const type = 'tab';

  if (addons.addMain) {
    addons.addMain(PANEL_ID, {
      type,
      title,
      route: '/info/',
      render,
    });
  } else {
    addons.addPanel(PANEL_ID, {
      title,
      render,
    });
  }
});
