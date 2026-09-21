import preview from '../../.rnstorybook/preview';
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

export default meta;

export const Basic = meta.story({
  args: {},
});
