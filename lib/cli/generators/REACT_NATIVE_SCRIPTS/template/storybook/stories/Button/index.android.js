import React from 'react';
import PropTypes from 'prop-types';
import { TouchableNativeFeedback } from 'react-native';

const Button = props => (
  <TouchableNativeFeedback onPress={props.onPress}>
    {props.children}
  </TouchableNativeFeedback>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func,
};
Button.defaultProps = {
  onPress: () => {},
};

export { Button as default };
