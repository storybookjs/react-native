import preview from '#.storybook/preview';
import { Text, View } from 'react-native';

const NestedTitleComponent = () => (
  <View>
    <Text>This story should appear under FactoriesEdgeCases / Nested / Deeply</Text>
  </View>
);

const meta = preview.meta({
  title: 'FactoriesEdgeCases/Nested/Deeply',
  component: NestedTitleComponent,
});

export const Basic = meta.story({
  args: {},
});
