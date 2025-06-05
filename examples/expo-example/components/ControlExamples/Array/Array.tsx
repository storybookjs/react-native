import { Text, View, StyleSheet } from 'react-native';

export interface ArrayProps {
  list: string[];
}

export const Array = ({ list }: ArrayProps) => (
  <View testID="array-story-container">
    {list.map((item, index) => (
      <Text key={index} style={styles.item}>
        {item}
      </Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  item: { padding: 8 },
});
