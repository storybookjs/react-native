import React, { FunctionComponent } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  buttonText: string;
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: 16, paddingVertical: 8 },
});

export const Button: FunctionComponent<ButtonProps> = ({ onPress, buttonText }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text>{buttonText}</Text>
  </TouchableOpacity>
);
