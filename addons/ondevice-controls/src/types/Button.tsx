import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import styled from '@emotion/native';

const Label = styled.Text(({ theme }) => ({
  fontSize: 17,
  color: theme.labelColor || 'black',
}));

export interface ButtonTypeProps {
  knob: {
    name: string;
  };
  onPress: Function;
}

const ButtonType = ({ knob, onPress }: ButtonTypeProps) => (
  <TouchableOpacity style={styles.button} onPress={() => onPress(knob)}>
    <Label>{knob.name}</Label>
  </TouchableOpacity>
);

ButtonType.defaultProps = {
  knob: {},
};

ButtonType.propTypes = {};

ButtonType.serialize = (value) => value;
ButtonType.deserialize = (value) => value;

const styles = StyleSheet.create({
  button: { margin: 10 },
});

export default ButtonType;
