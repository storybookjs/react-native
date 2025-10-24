import { View, Text } from 'react-native';

const Stub = () => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}
  >
    <Text style={{ fontSize: 20, textAlign: 'center' }}>
      Storybook is disabled in the withStorybook metro wrapper.
    </Text>
  </View>
);

export default Stub;
