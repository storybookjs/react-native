/* eslint-disable */
import React from 'react';
import Button from './Button';

import { configure } from '@storybook/react';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Button',
};

export const story1 = () => <Button label="Story 1" />;
export const secondStory = () => <Button label="Story 2" onClick={action('click')} />;

secondStory.story = {
  name: 'second story',
};

export const complexStory = () => (
  <div>
    <Button label="The Button" onClick={action('onClick')} />
    <br />
  </div>
);

complexStory.story = {
  name: 'complex story',
};
