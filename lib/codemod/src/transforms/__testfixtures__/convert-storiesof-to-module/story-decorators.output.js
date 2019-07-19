import React from 'react';
import Button from './Button';

export default {
  title: 'Some.Button',
};

export const withStoryParamsAndDecorators = () => <Button label="The Button" />;

withStoryParamsAndDecorators.story = {
  name: 'with story params and decorators',

  parameters: {
    bar: 1,
  },

  decorators: [withKnobs, storyFn => <div className="foo">{storyFn}</div>],
};

export const withStoryDecorators = () => <Button label="The Button" />;

withStoryDecorators.story = {
  name: 'with story decorators',
  decorators: [withKnobs],
};
