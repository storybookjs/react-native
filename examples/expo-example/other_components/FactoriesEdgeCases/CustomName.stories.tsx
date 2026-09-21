import preview from '../../.rnstorybook/preview';
import { Text, View } from 'react-native';

const CustomNameComponent = ({ label }: { label: string }) => (
  <View>
    <Text>{label}</Text>
  </View>
);

const meta = preview.meta({
  title: 'FactoriesEdgeCases/Custom Name',
  component: CustomNameComponent,
});

export default meta;

export const StoryWithCustomName = meta.story({
  name: 'My Custom Display Name',
  args: { label: 'This story should show "My Custom Display Name" in the sidebar' },
});

export const StoryWithDefaultName = meta.story({
  args: { label: 'This story should show "Story With Default Name" in the sidebar' },
});
