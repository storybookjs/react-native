import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface ArrayProps {
  list: string[];
}

export const Array = ({ list }: ArrayProps) => (
  <View style={styles.container}>
    {list.map((item) => (
      <Text style={styles.item}>{item}</Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  item: { padding: 8 },
  container: { flexDirection: 'column' },
});
