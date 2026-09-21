import preview from '../../.rnstorybook/preview';
import { useRef } from 'react';
import { Text } from 'react-native';

const TestCase = () => {
  // eslint-disable-next-line react-hooks/refs, react-hooks/purity
  const unstableRef = useRef(Math.random().toString(36).slice(2, 11)).current;
  return <Text>{unstableRef}</Text>;
};

const meta = preview.meta({
  title: 'TestCase/Re-rendering',
  component: TestCase,
});

export default meta;

export const Basic = meta.story({
  args: {},
});
