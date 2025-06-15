import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

export interface ActionButtonProps {
  onPress?: TouchableOpacityProps['onPress'];
  text: string;
}

export const ActionButton = ({ onPress, text }: ActionButtonProps) => {
  return (
    <TouchableOpacity accessibilityRole="button" style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: 'purple',
    borderRadius: 8,
    alignItems: 'center',
  },
  text: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});
