import React from 'react';
import PropTypes from 'prop-types';
import style from './style';

export default function FullScreen(props) {
  return <div style={style.wrapper}>{props.children}</div>;
}

FullScreen.defaultProps = { children: null };
FullScreen.propTypes = { children: PropTypes.node };
