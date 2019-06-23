/* eslint-disable */
import React from 'react';
import Button from './Button';

// This isn't a valid story, but it tests the `import { comp } from ...` case
{
  export default {
    title: 'Some.Button',
    decorators: [withKnobs, storyFn => <div className="foo">{storyFn}</div>],
  };

  export const story1 = () => <Button label="The Button" />;
  story1.title = 'with decorator';
};
