import React from 'react';
import PropTypes from 'prop-types';
import { baseFonts } from '@storybook/components';

const defaultProps = { children: null };
const propTypes = { children: PropTypes.node };

export function P(props) {
  const style = {
    ...baseFonts,
    fontSize: '15px',
  };

  // <P> is oftentimes used as a parent element of
  // <a> and <pre> elements, which is why <div>
  // is used as the outputted element when parsing
  // marksy content rather than <p>.
  return <div style={style}>{props.children}</div>;
}

P.defaultProps = defaultProps;
P.propTypes = propTypes;

export function LI(props) {
  const style = {
    ...baseFonts,
    fontSize: '15px',
  };
  return <li style={style}>{props.children}</li>;
}

LI.defaultProps = defaultProps;
LI.propTypes = propTypes;

export function UL(props) {
  const style = {
    ...baseFonts,
    fontSize: '15px',
  };
  return <ul style={style}>{props.children}</ul>;
}

UL.defaultProps = defaultProps;
UL.propTypes = propTypes;

export function A(props) {
  const style = {
    color: '#3498db',
  };
  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer" style={style}>
      {props.children}
    </a>
  );
}

A.defaultProps = defaultProps;
A.propTypes = { children: PropTypes.node, href: PropTypes.string.isRequired };
