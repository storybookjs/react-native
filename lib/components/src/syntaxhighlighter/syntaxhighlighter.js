import React, { Component } from 'react';
import styled from '@emotion/styled';
import { document, window } from 'global';
import memoize from 'memoizee';

import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import bash from 'react-syntax-highlighter/languages/prism/bash';
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/prism-light';

import { ActionBar, ActionButton } from '../panel_actionbar/panel_actionbar';

registerLanguage('jsx', jsx);
registerLanguage('bash', bash);

const themedSyntax = memoize(theme =>
  Object.entries(theme.code).reduce((acc, [key, val]) => ({ ...acc, [`* .${key}`]: val }), {})
);

const Wrapper = styled.div(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
}));
const Scroller = styled.div(
  ({ theme }) => ({
    position: 'relative',
    overflow: 'auto',
    padding: theme.layoutMargin,
  }),
  ({ theme }) => ({
    '& code': {
      paddingRight: theme.layoutMargin,
    },
  }),
  ({ theme }) => themedSyntax(theme)
);

const Pre = styled.pre({
  display: 'flex',
  justifyContent: 'flex-start',
  margin: 0,
  padding: 0,
});
const Code = styled.code({
  flex: 1,
  paddingRight: 0,
});

export default class Copyable extends Component {
  state = { copied: false };

  onClick = e => {
    const { children } = this.props;

    e.preventDefault();
    const tmp = document.createElement('TEXTAREA');
    const focus = document.activeElement;

    tmp.value = children;

    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
    focus.focus();

    this.setState({ copied: true }, () => {
      window.setTimeout(() => this.setState({ copied: false }), 1500);
    });
  };

  render() {
    const { children, language = 'jsx', copyable = true, ...rest } = this.props;
    const { copied } = this.state;

    return children ? (
      <Wrapper>
        <Scroller>
          <SyntaxHighlighter
            language={language}
            useInlineStyles={false}
            PreTag={Pre}
            CodeTag={Code}
            lineNumberContainerStyle={{}}
            {...rest}
          >
            {children.trim()}
          </SyntaxHighlighter>
        </Scroller>
        {copyable ? (
          <ActionBar>
            <ActionButton onClick={this.onClick}>{copied ? 'copied' : 'copy'}</ActionButton>
          </ActionBar>
        ) : null}
      </Wrapper>
    ) : null;
  }
}
