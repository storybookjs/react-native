import type { StoryObj, Meta } from '@storybook/react-native';
import { View, StyleSheet, Text } from 'react-native';

function UsableAreaContent() {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        borderWidth: 4,
        borderColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>This box should reach all corners of the content area.</Text>
    </View>
  );
}
const meta = {
  component: UsableAreaContent,
} satisfies Meta<typeof UsableAreaContent>;

export default meta;

type UsableAreaStory = StoryObj<typeof meta>;

export const SafeArea: UsableAreaStory = { parameters: { noSafeArea: false } };

export const NoSafeArea: UsableAreaStory = { parameters: { noSafeArea: true } };
