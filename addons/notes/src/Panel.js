import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { SyntaxHighlighter, Placeholder } from '@storybook/components';
import Markdown from 'markdown-to-jsx';
import { STORY_CHANGED } from '@storybook/core-events';
import { PARAM_KEY } from './shared';

const Panel = styled.div({
  padding: 10,
  boxSizing: 'border-box',
  width: '100%',
});

const read = params => (typeof params === 'string' ? params : params.text || params.markdown);

export default class NotesPanel extends React.Component {
  state = {
    value: '',
  };

  // use our SyntaxHighlighter component in place of a <code> element when
  // converting markdown to react elements
  markdownOpts = { overrides: { code: SyntaxHighlighter } };

  componentDidMount() {
    this.mounted = true;
    const { api } = this.props;

    api.on(STORY_CHANGED, this.onStoryChange);
  }

  componentWillUnmount() {
    this.mounted = false;
    const { api } = this.props;

    api.off(STORY_CHANGED, this.onStoryChange);
  }

  onStoryChange = id => {
    const { api } = this.props;
    const params = api.getParameters(id, PARAM_KEY);

    if (params && !params.disable) {
      const value = read(params);
      this.setState({ value });
    } else {
      this.setState({ value: undefined });
    }
  };

  render() {
    const { active } = this.props;
    const { value } = this.state;

    if (!active) {
      return null;
    }

    return value ? (
      <Panel className="addon-notes-container">
        <Markdown options={this.markdownOpts}>{value}</Markdown>
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
