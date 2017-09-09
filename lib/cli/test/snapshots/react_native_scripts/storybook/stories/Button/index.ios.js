import React from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight } from 'react-native';

const Button = props => (
  <TouchableHighlight onPress={props.onPress}>{props.children}</TouchableHighlight>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func,
};
Button.defaultProps = {
  onPress: () => {},
};

export { Button as default };
