import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface Props {
  on: boolean;
}

const styles = StyleSheet.create({
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  on: { backgroundColor: 'yellow' },
  off: { backgroundColor: 'black' },
  onText: { color: 'black' },
  offText: { color: 'white' },
});

export const Switch = ({ on }: Props) => (
  <View style={[styles.circle, on ? styles.on : styles.off]}>
    <Text style={on ? styles.onText : styles.offText}>{on ? 'on' : 'off'}</Text>
  </View>
);
