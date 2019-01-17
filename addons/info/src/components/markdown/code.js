import React from 'react';
import PropTypes from 'prop-types';
import { SyntaxHighlighter } from '@storybook/components';

// XXX: is this a bug? should it be (props) => ?
const Code = ({ props }) => <SyntaxHighlighter bordered copyable {...props} />;

Code.propTypes = {
  props: PropTypes.shape({}).isRequired,
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
