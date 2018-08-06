import React from 'react';
import PropTypes from 'prop-types';
import style from './style';

export default function FullScreen({ children }) {
  return <div style={style.wrapper}>{children}</div>;
}

FullScreen.defaultProps = { children: null };
FullScreen.propTypes = { children: PropTypes.node };
