import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { StyleSheet, TextInput } from 'react-native';

export default {
  title: 'TextInput',
  component: TextInput,
  args: {
    placeholder: 'Type something here',
  },
  parameters: {
    notes: 'Use this example to test the software keyboard related issues.',
  },
} as ComponentMeta<typeof TextInput>;

type TextInputStory = ComponentStory<typeof TextInput>;

const styles = StyleSheet.create({
  input: { borderColor: 'darkgrey', borderWidth: 1, padding: 8, borderRadius: 4 },
});

export const Basic: TextInputStory = (args) => (
  <TextInput underlineColorAndroid="transparent" style={styles.input} {...args} />
);
