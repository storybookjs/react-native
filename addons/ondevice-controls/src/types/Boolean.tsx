import { View, Switch, StyleSheet } from 'react-native';
import React from 'react';

export interface BooleanProps {
  onChange: (value: boolean) => void;
  arg: {
    name: string;
    value: boolean;
  };
}

const BooleanType = ({ arg, onChange }: BooleanProps) => (
  <View style={styles.switch}>
    <Switch testID={arg.name} onValueChange={() => onChange(!arg.value)} value={arg.value} />
  </View>
);

const styles = StyleSheet.create({
  switch: { margin: 10, alignItems: 'flex-start' },
});

BooleanType.serialize = (value) => (value ? String(value) : null);

BooleanType.deserialize = (value) => value === 'true';

export default BooleanType;
