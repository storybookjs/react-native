/* eslint-disable */
import React from 'react';
import Button from './Button';

export default {
  title: 'Button1',
};

export const story1 = () => <Button label="Button1.1" />;

story1.story = {
  name: 'story1',
};

export const story2 = () => <Button label="Button1.2" />;

story2.story = {
  name: 'story2',
};

export default {
  title: 'Button2',
};

export const story1Story = () => <Button label="Button2.1" />;

story1Story.story = {
  name: 'story1',
};

export const story2Story = () => <Button label="Button2.2" />;

story2Story.story = {
  name: 'story2',
};
