import React from 'react';
import Button from './Button';

export default {
  title: 'Some.Button',
  decorators: [withKnobs, storyFn => <div className="foo">{storyFn}</div>],
};

export const story1 = () => <Button label="The Button" />;
story1.story = {
  name: 'with decorator',
  decorators: [withKnobs],
};
