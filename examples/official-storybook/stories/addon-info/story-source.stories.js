import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import BaseButton from '../../components/BaseButton';
import TableComponent from '../../components/TableComponent';

export default {
  title: 'Addons/Info/Story Source',
  decorators: [withInfo],
};

export const OneProp = () => <BaseButton label="Button" />;
OneProp.story = { name: 'One prop' };

export const ManyProps = () => <BaseButton label="Button" onClick={action('clicked')} disabled />;
ManyProps.story = { name: 'Many props' };

export const Children = () => (
  <div>
    <p>Here is my nice button:</p>
    <BaseButton label="Button" onClick={action('clicked')} />
  </div>
);
Children.story = { name: 'Children' };

export const ArrayProp = () => {
  const propDefs = [
    {
      property: 'label',
      propType: { name: 'string' },
      required: true,
      description: 'Text to display inside button',
    },
    {
      property: 'disabled',
      propType: { name: 'boolean' },
      required: false,
      defaultValue: false,
    },
    {
      property: 'onClick',
      propType: { name: 'function' },
      description: 'Callback for when button is clicked',
      required: true,
      defaultValue: () => {},
    },
    {
      property: 'style',
      propType: { name: 'object' },
      description: 'Styles to apply to button',
      required: false,
      defaultValue: {},
    },
  ];
  return <TableComponent propDefinitions={propDefs} />;
};
ArrayProp.story = { name: 'Array prop' };

export const ObjectProp = () => (
  <BaseButton
    label="Button"
    style={{
      color: 'midnightblue',
      backgroundColor: 'powderblue',
      fontSize: '16px',
      boxShadow: '1px 1px rgba(0, 0, 0, .07)',
      borderRadius: 5,
      padding: '4px 8px',
    }}
  />
);
ObjectProp.story = { name: 'Object prop' };
