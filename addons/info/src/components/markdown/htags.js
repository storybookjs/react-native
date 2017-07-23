import React from 'react';
import PropTypes from 'prop-types';
import { baseFonts } from '../theme';

const defaultProps = {
  children: null,
  id: null,
};
const propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
};

export function H1(props) {
  const styles = {
    ...baseFonts,
    borderBottom: '1px solid #eee',
    fontWeight: 600,
    margin: 0,
    padding: 0,
    fontSize: '40px',
  };
  return (
    <h1 id={props.id} style={styles}>
      {props.children}
    </h1>
  );
}

H1.defaultProps = defaultProps;
H1.propTypes = propTypes;

export function H2(props) {
  const styles = {
    ...baseFonts,
    fontWeight: 600,
    margin: 0,
    padding: 0,
    fontSize: '30px',
  };
  return (
    <h2 id={props.id} style={styles}>
      {props.children}
    </h2>
  );
}

H2.defaultProps = defaultProps;
H2.propTypes = propTypes;

export function H3(props) {
  const styles = {
    ...baseFonts,
    fontWeight: 600,
    margin: 0,
    padding: 0,
    fontSize: '22px',
    textTransform: 'uppercase',
  };
  return (
    <h3 id={props.id} style={styles}>
      {props.children}
    </h3>
  );
}

H3.defaultProps = defaultProps;
H3.propTypes = propTypes;

export function H4(props) {
  const styles = {
    ...baseFonts,
    fontWeight: 600,
    margin: 0,
    padding: 0,
    fontSize: '20px',
  };
  return (
    <h4 id={props.id} style={styles}>
      {props.children}
    </h4>
  );
}

H4.defaultProps = defaultProps;
H4.propTypes = propTypes;

export function H5(props) {
  const styles = {
    ...baseFonts,
    fontWeight: 600,
    margin: 0,
    padding: 0,
    fontSize: '18px',
  };
  return (
    <h5 id={props.id} style={styles}>
      {props.children}
    </h5>
  );
}

H5.defaultProps = defaultProps;
H5.propTypes = propTypes;

export function H6(props) {
  const styles = {
    ...baseFonts,
    fontWeight: 400,
    margin: 0,
    padding: 0,
    fontSize: '18px',
  };
  return (
    <h6 id={props.id} style={styles}>
      {props.children}
    </h6>
  );
}

H6.defaultProps = defaultProps;
H6.propTypes = propTypes;
