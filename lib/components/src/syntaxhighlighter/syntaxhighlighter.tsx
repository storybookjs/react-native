import React, { Component } from 'react';
import { styled } from '@storybook/theming';
import { document, window } from 'global';
import memoize from 'memoizerific';

import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import bash from 'react-syntax-highlighter/languages/prism/bash';
import css from 'react-syntax-highlighter/languages/prism/css';
import html from 'react-syntax-highlighter/languages/prism/markup';

import ReactSyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/prism-light';

import { ActionBar } from '../ActionBar/ActionBar';
import { ScrollArea } from '../ScrollArea/ScrollArea';

registerLanguage('jsx', jsx);
registerLanguage('bash', bash);
registerLanguage('css', css);
registerLanguage('html', html);

const themedSyntax = memoize(2)(theme =>
  Object.entries(theme.code || {}).reduce((acc, [key, val]) => ({ ...acc, [`* .${key}`]: val }), {})
);

interface WrapperProps {
  bordered?: boolean;
  padded?: boolean;
}

const Wrapper = styled.div<WrapperProps>(
  ({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    color: theme.color.defaultText,
  }),
  ({ theme, bordered }) =>
    bordered
      ? {
          border: `1px solid ${theme.appBorderColor}`,
          borderRadius: theme.borderRadius,
          background: theme.background.bar,
        }
      : {}
);

const Scroller = styled(({ children, className }) => (
  <ScrollArea horizontal vertical className={className}>
    {children}
  </ScrollArea>
))(
  {
    position: 'relative',
  },
  ({ theme }) => ({
    '& code': {
      paddingRight: theme.layoutMargin,
    },
  }),
  ({ theme }) => themedSyntax(theme)
);

interface PreProps {
  padded?: boolean;
}

const Pre = styled.pre<PreProps>(({ theme, padded }) => ({
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

export interface SyntaxHighlighterProps {
  language: string;
  copyable?: boolean;
  bordered?: boolean;
  padded?: boolean;
  format?: boolean;
  className?: string;
}

export interface SyntaxHighlighterState {
  copied: boolean;
}

type ReactSyntaxHighlighterProps = React.ComponentProps<typeof ReactSyntaxHighlighter>;

const formatter = memoize(2)((code: string) => {
  // code provided to the component is often coming from template literals, which preserve whitespace.
  // sometimes the first line doesn't have padding, but the second does.
  // we split the code-string into lines, then if we find padding on line 0 or 1,
  // we assume that padding is bad, and remove that much padding on all following lines
  return code
    .split(/\n/)
    .reduce(
      (acc, i, index) => {
        const match = i.match(/^((:?\s|\t)+)/);
        const padding = match ? match[1] : '';

        if (acc.firstIndent === '' && padding && index < 3) {
          return { result: `${acc.result}\n${i.replace(padding, '')}`, firstIndent: padding };
        }
        return {
          result: `${acc.result}\n${i.replace(acc.firstIndent, '')}`,
          firstIndent: acc.firstIndent,
        };
      },
      { firstIndent: '', result: '' }
    )
    .result.trim();
});

export class SyntaxHighlighter extends Component<
  SyntaxHighlighterProps & ReactSyntaxHighlighterProps,
  SyntaxHighlighterState
> {
  static defaultProps: SyntaxHighlighterProps = {
    language: null,
    copyable: false,
    bordered: false,
    padded: false,
    format: true,
    className: null,
  };

  state = { copied: false };

  onClick = (e: React.MouseEvent) => {
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
    const {
      children,
      language = 'jsx',
      copyable,
      bordered,
      padded,
      format,
      className,
      ...rest
    } = this.props;
    const { copied } = this.state;

    return children ? (
      <Wrapper bordered={bordered} padded={padded} className={className}>
        <Scroller>
          <ReactSyntaxHighlighter
            padded={padded || bordered}
            language={language}
            useInlineStyles={false}
            PreTag={Pre}
            CodeTag={Code}
            lineNumberContainerStyle={{}}
            {...rest}
          >
            {format ? formatter((children as string).trim()) : (children as string).trim()}
          </ReactSyntaxHighlighter>
        </Scroller>
        {copyable ? (
          <ActionBar actionItems={[{ title: copied ? 'Copied' : 'Copy', onClick: this.onClick }]} />
        ) : null}
      </Wrapper>
    ) : null;
  }
}
