import React, { FunctionComponent } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

export interface Props {
  isEnabled: boolean;
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: 16, paddingVertical: 8 },
});

export const BooleanButton: FunctionComponent<Props> = ({ isEnabled }: Props) => (
  <TouchableOpacity style={styles.button} disabled={!isEnabled}>
    <Text>{isEnabled ? 'Enabled' : 'Disabled'}</Text>
    <Text>Toggle via Addons -&gt; Controls</Text>
  </TouchableOpacity>
);
