import React from 'react';

import { Form } from '@storybook/components';

const text = 'Testing the a11y addon';

export default {
  title: 'Addons/A11y/Form',
  component: Form,
  parameters: {
    options: { selectedPanel: 'storybook/a11y/panel' },
  },
};

export const WithoutLabel = () => (
  <Form.Field label="">
    <Form.Input />
  </Form.Field>
);
WithoutLabel.story = {
  name: 'Without Label',
};

export const WithLabel = () => (
  <Form.Field label={text}>
    <Form.Input id="1" />
  </Form.Field>
);
WithLabel.story = {
  name: 'With label',
};

export const WithPlaceholder = () => (
  <Form.Field label="">
    <Form.Input id="1" placeholder={text} />
  </Form.Field>
);
WithPlaceholder.story = {
  name: 'With placeholder',
};
