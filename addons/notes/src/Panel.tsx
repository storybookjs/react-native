import * as React from 'react';
import * as PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { STORY_CHANGED } from '@storybook/core-events';

import { SyntaxHighlighter as SyntaxHighlighterBase, Placeholder } from '@storybook/components';
import Markdown from 'markdown-to-jsx';

import { PARAM_KEY, API, Parameters } from './shared';

const Panel = styled.div({
  padding: 10,
  boxSizing: 'border-box',
  width: '100%',
});


interface Props {
  active: boolean;
  api: API;
}

interface NotesPanelState {
  value: string;
}

const read = (params: Parameters): string =>
  typeof params === 'string' ? params : params.text || params.markdown;

const SyntaxHighlighter = (props: any) => <SyntaxHighlighterBase bordered copyable {...props} />;

export default class NotesPanel extends React.Component<Props, NotesPanelState> {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    api: PropTypes.shape({
      on: PropTypes.func,
      off: PropTypes.func,
      emit: PropTypes.func,

      getParameters: PropTypes.func,
    }).isRequired,
  };

  readonly state: NotesPanelState = {
    value: '',
  };

  mounted: boolean;

  // use our SyntaxHighlighter component in place of a <code> element when
  // converting markdown to react elements
  options = { overrides: { code: SyntaxHighlighter } };

  componentDidMount() {
    const { api } = this.props;
    api.on(STORY_CHANGED, this.onStoryChange);
  }

  componentWillUnmount() {
    const { api } = this.props;
    api.off(STORY_CHANGED, this.onStoryChange);
  }

  onStoryChange = (id: string) => {
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
        <Markdown options={this.options}>{value}</Markdown>
      </Panel>
    ) : (
      <Placeholder>There is no info/note</Placeholder>
    );
  }
}
