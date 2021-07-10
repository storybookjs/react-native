import React, { FunctionComponent } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  text: string;
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: 16, paddingVertical: 8 },
});

export const Button: FunctionComponent<ButtonProps> = ({ onPress, text }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text>{text}</Text>
  </TouchableOpacity>
);
