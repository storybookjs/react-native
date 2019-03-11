import React from 'react';
import PropTypes from 'prop-types';
import { SyntaxHighlighter } from '@storybook/components';
import { ThemeProvider, convert } from '@storybook/theming';

const Code = ({ code, language, ...props }) => (
  <ThemeProvider theme={convert()}>
    <SyntaxHighlighter bordered copyable language={language} {...props}>
      {code}
    </SyntaxHighlighter>
  </ThemeProvider>
);

Code.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string,
};

Code.defaultProps = {
  language: null,
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
