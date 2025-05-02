import { StyleSheet, Text, View } from 'react-native';

export interface ButtonProps {
  color: string;
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: 16, paddingVertical: 8 },
});

export const Color = ({ color }: ButtonProps) => (
  <View testID="color-story-container" style={[styles.button, { backgroundColor: color }]}>
    <Text>Color: {color as string}</Text>
  </View>
);
