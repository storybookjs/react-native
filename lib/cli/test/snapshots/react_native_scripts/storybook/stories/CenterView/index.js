import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import style from './style';

const CenterView = props => <View style={style.main}>{props.children}</View>;

CenterView.propTypes = {
  children: PropTypes.node.isRequired,
};

export { CenterView as default };
