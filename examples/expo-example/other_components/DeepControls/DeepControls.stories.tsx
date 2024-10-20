import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text } from 'react-native';

const DeepControls = () => {
  return <Text>Testing story with deep controls (storybook-addon-deep-controls)</Text>;
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
    'objectArg.enumString': {
      control: 'radio',
      options: ['value1', 'value2', 'value3'],
    },
  },
};
