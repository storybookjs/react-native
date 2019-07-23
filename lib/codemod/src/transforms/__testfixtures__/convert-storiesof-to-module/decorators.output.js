/* eslint-disable */
import React from 'react';
import Button from './Button';

export default {
  title: 'Some.Button',
  decorators: [withKnobs, storyFn => <div className="foo">{storyFn}</div>],
};

export const withDecorator = () => <Button label="The Button" />;

withDecorator.story = {
  name: 'with decorator',
};
