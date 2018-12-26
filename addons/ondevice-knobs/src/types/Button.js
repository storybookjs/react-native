import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const ButtonType = ({ knob, onPress }) => (
  <TouchableOpacity style={{ margin: 10 }} onPress={() => onPress(knob)}>
    <Text style={{ fontSize: 17, color: '#007aff' }}>{knob.name}</Text>
  </TouchableOpacity>
);

ButtonType.defaultProps = {
  knob: {},
};

ButtonType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
  }),
  onPress: PropTypes.func.isRequired,
};

ButtonType.serialize = value => value;
ButtonType.deserialize = value => value;

export default ButtonType;
