import React from 'react';
import Button from './Button';
import { action } from '@storybook/addon-actions';
export const rowData = {
  col1: 'a',
  col2: 2,
};

export default {
  title: 'Button',
  includeStories: ['story1', 'secondStory', 'complexStory'],
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
