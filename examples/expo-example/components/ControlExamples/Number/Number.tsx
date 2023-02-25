import React from 'react';
import { StyleSheet, Text } from 'react-native';

export interface Props {
  first: number;
  second: number;
}

const styles = StyleSheet.create({
  text: { fontSize: 18 },
});

export const Multiply = ({ first, second }: Props) => (
  <Text style={styles.text}>
    {first} x {second} = {first * second}
  </Text>
);
