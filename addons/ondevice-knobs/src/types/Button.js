import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';

const Label = styled.Text(({ theme }) => ({
  fontSize: 17,
  color: theme.labelColor,
}));

const ButtonType = ({ knob, onPress }) => (
  <TouchableOpacity style={{ margin: 10 }} onPress={() => onPress(knob)}>
    <Label>{knob.name}</Label>
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
