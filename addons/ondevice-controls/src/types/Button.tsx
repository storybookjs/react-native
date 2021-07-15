import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import styled from '@emotion/native';

const Label = styled.Text(({ theme }) => ({
  fontSize: 18,
  color: theme.labelColor || 'black',
}));

export interface ButtonTypeProps {
  arg: {
    name: string;
  };
  onPress: Function;
}

const ButtonType = ({ arg, onPress }: ButtonTypeProps) => (
  <TouchableOpacity style={styles.button} onPress={() => onPress(arg)}>
    <Label>{arg.name}</Label>
  </TouchableOpacity>
);

ButtonType.propTypes = {};

ButtonType.serialize = (value) => value;
ButtonType.deserialize = (value) => value;

const styles = StyleSheet.create({
  button: { margin: 8 },
});

export default ButtonType;
