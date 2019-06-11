import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { style } from './style';

export const FullScreen: FunctionComponent = ({ children }) => {
  return <div style={style.wrapper}>{children}</div>;
};

FullScreen.defaultProps = { children: null };
FullScreen.propTypes = { children: PropTypes.node };
