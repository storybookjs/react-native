import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { SyntaxHighlighter, Placeholder } from '@storybook/components';
import Markdown from 'markdown-to-jsx';
import Events from '@storybook/core-events';
import { EVENT_ID } from './shared';

const Panel = styled.div({
  padding: 10,
  boxSizing: 'border-box',
  width: '100%',
});

export default class NotesPanel extends React.Component {
  state = {
    markdown: '',
  };

  // use our SyntaxHighlighter component in place of a <code> element when
  // converting markdown to react elements
  markdownOpts = { overrides: { code: SyntaxHighlighter } };

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
    channel.on(EVENT_ID, this.onAddNotes);
    channel.on(Events.SET_CURRENT_STORY, this.clearNotes);
  }

  componentWillUnmount() {
    this.mounted = false;
    const { channel } = this.props;

    this.stopListeningOnStory();
    channel.removeListener('storybook/notes/add_notes', this.onAddNotes);
  }

  onAddNotes = markdown => {
    this.setState({ markdown });
  };

  clearNotes = () => {
    this.setState({ markdown: '' });
  };

  render() {
    const { active } = this.props;
    const { markdown } = this.state;

    if (!active) {
      return null;
    }

    return markdown ? (
      <Panel className="addon-notes-container">
        <Markdown options={this.markdownOpts}>{markdown}</Markdown>
      </Panel>
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
