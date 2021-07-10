import React, { FunctionComponent } from 'react';
import { View, StyleSheet, Text, ColorValue } from 'react-native';

interface ButtonProps {
  color: ColorValue;
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: 16, paddingVertical: 8 },
});

export const Color: FunctionComponent<ButtonProps> = ({ color }) => (
  <View style={[styles.button, { backgroundColor: color }]}>
    <Text>Color: {color}</Text>
  </View>
);
