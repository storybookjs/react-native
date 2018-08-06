import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import style from './style';

const CenterView = ({ children }) => <View style={style.main}>{children}</View>;

CenterView.propTypes = {
  children: PropTypes.node.isRequired,
};

export { CenterView as default };
