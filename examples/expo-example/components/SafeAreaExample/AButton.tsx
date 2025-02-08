import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AButtonProps {
  onPress: () => void;
  text: string;
}

export const AButton = ({ onPress, text }: AButtonProps) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Text style={styles.text}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'violet' },
  text: { color: 'black' },
});
