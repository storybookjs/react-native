import React, { Component } from 'react';
import { styled } from '@storybook/theming';
import { document, window } from 'global';
import memoize from 'memoizerific';

import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import bash from 'react-syntax-highlighter/languages/prism/bash';
import css from 'react-syntax-highlighter/languages/prism/css';
import html from 'react-syntax-highlighter/languages/prism/markup';

import ReactSyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/prism-light';

import { js as beautify } from 'js-beautify';
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
  {
    position: 'relative',
    overflow: 'hidden',
  },
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

  formatCode = memoize(2)((language: string, code: string) => {
    let formattedCode = code;
    if (language === 'jsx') {
      try {
        // tslint:disable-next-line:no-object-literal-type-assertion
        formattedCode = beautify(code, {
          indent_size: 2,
          brace_style: 'collapse-preserve-inline',
          end_with_newline: true,
          wrap_line_length: 80,
          e4x: true, // e4x is not available in JsBeautify types for now
        } as JsBeautifyOptions);
      } catch (error) {
        console.warn("Couldn't format code", formattedCode); // eslint-disable-line no-console
      }
    }
    return formattedCode;
  });

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
            {format
              ? this.formatCode(language, (children as string).trim())
              : (children as string).trim()}
          </ReactSyntaxHighlighter>
        </Scroller>
        {copyable ? (
          <ActionBar actionItems={[{ title: copied ? 'Copied' : 'Copy', onClick: this.onClick }]} />
        ) : null}
      </Wrapper>
    ) : null;
  }
}
