import React, { Component } from 'react';
import { withCSSContext } from '@emotion/core';
import styled from '@emotion/styled';
import { document, window } from 'global';
import memoize from 'memoizee';

import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import bash from 'react-syntax-highlighter/languages/prism/bash';
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/prism-light';

import { ActionBar, ActionButton } from '../panel_actionbar/panel_actionbar';

registerLanguage('jsx', jsx);
registerLanguage('bash', bash);

const deepCopy = memoize(input => JSON.parse(JSON.stringify(input)));

const Wrapper = styled.div(({ theme }) => ({
  position: 'relative',
  background: theme.code['pre[class*="language-"]'].backgroundColor,
  border: theme.mainBorder,
  borderRadius: theme.mainBorderRadius,
  overflow: 'hidden',
}));
const Scroller = styled.div({
  display: 'flex',
  position: 'relative',
  overflow: 'auto',
  justifyContent: 'flex-start',
});

class Copyable extends Component {
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
    const { children, language = 'jsx', copyable = true, theme, ...rest } = this.props;
    const { copied } = this.state;

    const themeCopy = deepCopy(theme.code);
    const style = {
      ...themeCopy,
      'pre[class*="language-"]': {
        ...themeCopy['pre[class*="language-"]'],
        paddingRight: 65,
      },
    };

    return (
      <Wrapper>
        <Scroller>
          <SyntaxHighlighter language={language} style={style} {...rest}>
            {children}
          </SyntaxHighlighter>
        </Scroller>
        {copyable ? (
          <ActionBar>
            <ActionButton onClick={this.onClick}>{copied ? 'copied' : 'copy'}</ActionButton>
          </ActionBar>
        ) : null}
      </Wrapper>
    );
  }
}

export default withCSSContext(({ children, ...rest }, { theme }) => (
  <Copyable theme={theme} {...rest}>
    {children}
  </Copyable>
));
