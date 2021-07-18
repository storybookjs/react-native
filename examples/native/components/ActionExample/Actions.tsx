import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ActionButtonProps {
  onPress: () => void;
}

export const ActionButton = ({ onPress }: ActionButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>ActionButton</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'violet' },
  text: { color: 'black' },
});
