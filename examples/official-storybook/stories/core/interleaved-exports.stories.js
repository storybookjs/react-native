/* eslint-disable import/first,import/no-duplicates */
import React from 'react';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Core/Interleaved exports',
  parameters: { chromatic: { disable: true } },
};

import { Welcome } from '@storybook/react/demo';

export const First = () => <Welcome showApp={action('show')} />;

import { Button } from '@storybook/react/demo';

export const Second = () => <Button onClick={action('click')}>Second</Button>;
