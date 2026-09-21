import preview from '../../.rnstorybook/preview';
import { Text, View } from 'react-native';

const DeepControls = ({
  objectArg,
}: {
  objectArg: {
    string: string;
    number: number;
    boolean: boolean;
    enumString: string;
    nested: { number: number; boolean: boolean };
  };
}) => {
  return (
    <View style={{ gap: 10 }}>
      <Text>Testing story with deep controls (storybook-addon-deep-controls)</Text>
      <Text>{JSON.stringify(objectArg, null, 2)}</Text>
    </View>
  );
};

const meta = preview.meta({
  component: DeepControls,
});

export default meta;

export const Basic = meta.story({
  parameters: {
    deepControls: { enabled: true },
  },
  args: {
    objectArg: {
      string: 'foo',
      number: 42,
      boolean: true,
      enumString: 'value2',
      nested: {
        number: 222,
        boolean: false,
      },
    },
  },
  // Deep controls currently broken for factories
  argTypes: {
    'objectArg.enumString': {
      control: 'radio',
      options: ['value1', 'value2', 'value3'],
    },
    'objectArg.boolean': {
      control: 'boolean',
    },
    'objectArg.number': {
      control: 'number',
    },
    'objectArg.string': {
      control: 'text',
    },
    'objectArg.nested.boolean': {
      control: 'boolean',
    },
    'objectArg.nested.number': {
      control: 'number',
    },
  } as any,
});
