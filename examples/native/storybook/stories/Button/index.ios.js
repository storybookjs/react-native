import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';

export default function Button({ onPress, children }) {
  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
}

Button.defaultProps = {
  children: null,
  onPress: () => {},
};

Button.propTypes = {
  children: PropTypes.node,
  onPress: PropTypes.func,
};
