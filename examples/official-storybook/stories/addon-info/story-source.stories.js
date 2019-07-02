import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import BaseButton from '../../components/BaseButton';
import TableComponent from '../../components/TableComponent';

export default {
  title: 'Addons|Info/Story Source',
  decorators: [withInfo],
};

export const oneProp = () => <BaseButton label="Button" />;
oneProp.story = { name: 'One prop' };

export const manyProps = () => <BaseButton label="Button" onClick={action('clicked')} disabled />;
manyProps.story = { name: 'Many props' };

export const children = () => (
  <div>
    <p>Here is my nice button:</p>
    <BaseButton label="Button" onClick={action('clicked')} />
  </div>
);
children.story = { name: 'Children' };

export const arrayProp = () => {
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
arrayProp.story = { name: 'Array prop' };

export const objectProp = () => (
  <BaseButton
    label="Button"
    style={{
      color: 'midnightblue',
      backgroundColor: 'powderblue',
      fontSize: '16px',
      boxShadow: '1px 1px rgba(0, 0, 0, .07)',
      borderRadius: '5px',
      padding: '4px 8px',
    }}
  />
);
objectProp.story = { name: 'Object prop' };
