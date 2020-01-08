import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { radios } from '@storybook/addon-knobs';
import Button, { Type } from '../../components/TsButton';

export default {
  title: 'Addons/Docs/TsButton',
  component: Button,
};

type Story = () => any;

export const SimpleButton: Story = () => {
  const x = 0;
  return <Button onClick={action('button clicked')}>OK {x}</Button>;
};

const typeOptions = {
  Default: 'default',
  Action: 'action',
};

export const WithType = () => (
  <Button type={radios('Type', typeOptions, typeOptions.Default) as Type}>Label</Button>
);
