import React, { FunctionComponent } from 'react';
import { TouchableOpacity, StyleSheet, Text, ColorValue } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  buttonText: string;
  num: number;
  buttonColor: ColorValue;
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: 16, paddingVertical: 8 },
});

export const Button: FunctionComponent<ButtonProps> = ({
  onPress,
  buttonText,
  num,
  buttonColor,
}) => (
  <TouchableOpacity style={[styles.button, { backgroundColor: buttonColor }]} onPress={onPress}>
    <Text>
      {buttonText}:{num}
    </Text>
  </TouchableOpacity>
);
