import React from 'react';
import PropTypes from 'prop-types';

const defaultProps = { children: null };
const propTypes = { children: PropTypes.node };

export function P({ children }) {
  const style = {
    fontSize: '15px',
  };

  // <P> is oftentimes used as a parent element of
  // <a> and <pre> elements, which is why <div>
  // is used as the outputted element when parsing
  // marksy content rather than <p>.
  return <div style={style}>{children}</div>;
}

P.defaultProps = defaultProps;
P.propTypes = propTypes;

export function LI({ children }) {
  const style = {
    fontSize: '15px',
  };
  return <li style={style}>{children}</li>;
}

LI.defaultProps = defaultProps;
LI.propTypes = propTypes;

export function UL({ children }) {
  const style = {
    fontSize: '15px',
  };
  return <ul style={style}>{children}</ul>;
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
