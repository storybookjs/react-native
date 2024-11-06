import { Meta, StoryObj } from '@storybook/react';
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

export default {
  title: 'DeepControls',
  component: DeepControls,
} satisfies Meta<typeof DeepControls>;

export const Basic: StoryObj<typeof DeepControls> = {
  parameters: {
    deepControls: { enabled: true },
  },
  args: {
    objectArg: {
      string: 'foo',
      number: 42,
      boolean: true,
      enumString: 'value2', // we only want specific values for this
      nested: {
        number: 222,
        boolean: false,
      },
    },
  },
  argTypes: {
    // so we define an argType for the property to use a radio control with specific values
    // @ts-expect-error
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
  },
};
