import React from 'react';
import PropTypes from 'prop-types';

const defaultProps = { children: null };
const propTypes = { children: PropTypes.node };

export function P({ children }) {
  return <p>{children}</p>;
}

P.defaultProps = defaultProps;
P.propTypes = propTypes;

export function LI({ children }) {
  return <li>{children}</li>;
}

LI.defaultProps = defaultProps;
LI.propTypes = propTypes;

export function UL({ children }) {
  return <ul>{children}</ul>;
}

UL.defaultProps = defaultProps;
UL.propTypes = propTypes;

export function A({ href, children }) {
  const style = {
    color: '#3498db',
  };
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
      {children}
    </a>
  );
}

A.defaultProps = defaultProps;
A.propTypes = { children: PropTypes.node, href: PropTypes.string.isRequired };
