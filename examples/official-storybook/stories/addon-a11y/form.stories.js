import React from 'react';

import { Form } from '@storybook/components';

const text = 'Testing the a11y addon';

export default {
  title: 'Addons|A11y/Form',
  component: Form,
  parameters: {
    options: { selectedPanel: 'storybook/a11y/panel' },
  },
};

export const withoutLabel = () => (
  <Form.Field label="">
    <Form.Input />
  </Form.Field>
);
withoutLabel.story = {
  name: 'Without Label',
};

export const withLabel = () => (
  <Form.Field label={text}>
    <Form.Input id="1" />
  </Form.Field>
);
withLabel.story = {
  name: 'With label',
};

export const withPlaceholder = () => (
  <Form.Field label="">
    <Form.Input id="1" placeholder={text} />
  </Form.Field>
);
withPlaceholder.story = {
  name: 'With placeholder',
};
