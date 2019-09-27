/* eslint-disable */
import React from 'react';
import Button from './Button';

import { configure } from '@storybook/react';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Button',
};

export const story1 = () => <Button label="Story 1" />;

story1.story = {
  name: 'story1',
};

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

export const wPunctuation = () => <Button label="Story 2" onClick={action('click')} />;

wPunctuation.story = {
  name: 'w/punctuation',
};

export const startCase = () => <Button label="Story 2" onClick={action('click')} />;
