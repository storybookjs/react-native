import * as React from 'react';
import * as PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { SyntaxHighlighter as SyntaxHighlighterBase, Placeholder } from '@storybook/components';
import Markdown from 'markdown-to-jsx';
import { STORY_CHANGED } from '@storybook/core-events';
import { PARAM_KEY } from './shared';

const Panel = styled.div({
  padding: 10,
  boxSizing: 'border-box',
  width: '100%'
});

interface NotesPanelProps {
  active: boolean;
  channel: {
    emit: any;
    on(listener: string, callback: (text: string) => void): any;
    removeListener(listener: string, callback: (text: string) => void): void;
  };
  api: {
    setQueryParams: any; // todo check correct definition
    getQueryParam(queryParamName: string): any;
    onStory(callback: () => void): () => void;
  };
}

interface NotesPanelState {
  value: string;
}

type ReadParams = string | { text: string; markdown: string };
const read = (params: ReadParams) => (typeof params === 'string' ? params : params.text || params.markdown);
const SyntaxHighlighter = (props: NotesPanelProps) => <SyntaxHighlighterBase bordered copyable {...props} />;

export default class NotesPanel extends React.Component<NotesPanelProps, NotesPanelState> {

  static propTypes = {
    active: PropTypes.bool.isRequired,
    channel: PropTypes.shape({
      on: PropTypes.func,
      emit: PropTypes.func,
      removeListener: PropTypes.func
    }).isRequired,
    api: PropTypes.shape({
      onStory: PropTypes.func,
      getQueryParam: PropTypes.func,
      setQueryParams: PropTypes.func
    }).isRequired
  };

  readonly state: NotesPanelState = {
    value: ''
  };

  mounted: boolean;

  // use our SyntaxHighlighter component in place of a <code> element when
  // converting markdown to react elements
  options = { overrides: { code: SyntaxHighlighter } };

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
        <Markdown options={this.options}>{value}</Markdown>
      </Panel>
    ) : (
      <Placeholder>There is no info/note</Placeholder>
    );
  }
}
