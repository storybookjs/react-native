import preview from '../../.rnstorybook/preview';
import { Text, View } from 'react-native';

const IncludeComponent = ({ label }: { label: string }) => (
  <View>
    <Text>{label}</Text>
  </View>
);

const meta = preview.meta({
  title: 'FactoriesEdgeCases/Include Stories',
  component: IncludeComponent,
  includeStories: ['OnlyThisOne'],
});

export default meta;

export const OnlyThisOne = meta.story({
  args: { label: 'This story should be visible (included)' },
});

export const ShouldBeExcluded = meta.story({
  args: { label: 'This story should NOT appear (not in includeStories)' },
});
