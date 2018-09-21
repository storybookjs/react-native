import React, { Component } from 'react';
import styled from '@emotion/styled';
import { document, window } from 'global';
import memoize from 'memoizerific';

import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import bash from 'react-syntax-highlighter/languages/prism/bash';
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/prism-light';

import { ActionBar, ActionButton } from '../panel_actionbar/panel_actionbar';

registerLanguage('jsx', jsx);
registerLanguage('bash', bash);

const themedSyntax = memoize(2)(theme =>
  Object.entries(theme.code).reduce((acc, [key, val]) => ({ ...acc, [`* .${key}`]: val }), {})
);

const Wrapper = styled.div(
  {
    position: 'relative',
    overflow: 'hidden',
  },
  ({ theme, bordered }) =>
    bordered
      ? {
          border: theme.mainBorder,
          borderRadius: theme.mainBorderRadius,
          background: theme.barFill,
        }
      : {}
);
const Scroller = styled.div(
  {
    position: 'relative',
    overflow: 'auto',
  },
  ({ theme }) => ({
    '& code': {
      paddingRight: theme.layoutMargin,
      opacity: 0.7,
    },
  }),
  ({ theme }) => themedSyntax(theme)
);
const Pre = styled.pre(({ theme, padded }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  margin: 0,
  padding: padded ? theme.layoutMargin : 0,
}));
const Code = styled.code({
  flex: 1,
  paddingRight: 0,
  opacity: 1,
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
    const { children, language = 'jsx', copyable = true, bordered, padded, ...rest } = this.props;
    const { copied } = this.state;

    return children ? (
      <Wrapper bordered={bordered} padded={padded}>
        <Scroller>
          <SyntaxHighlighter
            padded={padded || bordered}
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
