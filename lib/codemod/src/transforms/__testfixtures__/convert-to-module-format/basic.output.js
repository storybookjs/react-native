/* eslint-disable */
import React from 'react';
import Button from './Button';

import { configure } from '@storybook/react';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Button',
};

export const story1 = () => <Button label="Story 1" />;
export const story2 = () => <Button label="Story 2" onClick={action('click')} />;
story2.title = 'second story';

export const story3 = () => (
  <div>
    <Button label="The Button" onClick={action('onClick')} />
    <br />
  </div>
);

story3.title = 'complex story';
