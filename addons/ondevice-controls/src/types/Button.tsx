import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';

const Label = styled.Text(({ theme }) => ({
  fontSize: 17,
  color: theme.labelColor || 'black',
}));

interface ButtonProps {
  knob: {
    name: string;
  };
  onPress: Function;
}

const ButtonType = ({ knob, onPress }: ButtonProps) => (
  <TouchableOpacity style={{ margin: 10 }} onPress={() => onPress(knob)}>
    <Label>{knob.name}</Label>
  </TouchableOpacity>
);

ButtonType.defaultProps = {
  knob: {},
};

ButtonType.propTypes = {};

ButtonType.serialize = (value) => value;
ButtonType.deserialize = (value) => value;

export default ButtonType;
