import preview from '../../.rnstorybook/preview';
import { Text, View } from 'react-native';

const ExcludeComponent = ({ label }: { label: string }) => (
  <View>
    <Text>{label}</Text>
  </View>
);

const meta = preview.meta({
  title: 'FactoriesEdgeCases/Exclude Stories',
  component: ExcludeComponent,
  excludeStories: ['ShouldBeExcluded'],
});

export default meta;

export const Visible = meta.story({
  args: { label: 'This story should be visible' },
});

export const ShouldBeExcluded = meta.story({
  args: { label: 'This story should NOT appear in the sidebar' },
});
