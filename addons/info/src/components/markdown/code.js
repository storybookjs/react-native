import React from 'react';
import PropTypes from 'prop-types';
import { SyntaxHighlighter } from '@storybook/components';
import { ThemeProvider, convert } from '@storybook/theming';

const Code = ({ code, language = 'plaintext', ...rest }) => (
  <ThemeProvider theme={convert()}>
    <SyntaxHighlighter bordered copyable format={false} language={language} {...rest}>
      {code}
    </SyntaxHighlighter>
  </ThemeProvider>
);
Code.propTypes = {
  language: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
};

export { Code };

export function Blockquote({ children }) {
  const style = {
    fontSize: '1.88em',
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    borderLeft: '8px solid #fafafa',
    padding: '1rem',
  };
  return <blockquote style={style}>{children}</blockquote>;
}

Blockquote.propTypes = { children: PropTypes.node };
Blockquote.defaultProps = { children: null };

export { default as Pre } from './pre/pre';
