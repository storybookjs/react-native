import preview from '../../.rnstorybook/preview';
import { Text } from 'react-native';

const TestCase2 = () => {
  return <Text>Testing story globs and nested stories</Text>;
};

const meta = preview.meta({
  title: 'TestCase/Nested stories',
  component: TestCase2,
});

export default meta;

export const Basic = meta.story({
  args: {},
});
