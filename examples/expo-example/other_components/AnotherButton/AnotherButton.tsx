import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  text: string;
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: 16, paddingVertical: 8 },
});

export const Button = ({ onPress, text }: ButtonProps) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text>{text}</Text>
  </TouchableOpacity>
);
