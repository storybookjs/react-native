import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';

export default {
  title: 'Addons|Docs/mdx',
  component: Button,

  decorators: [
    storyFn => (
      <div
        style={{
          backgroundColor: 'yellow',
        }}
      >
        {storyFn()}
      </div>
    ),
  ],

  parameters: {
    notes: 'component notes',
  },
};

export const soloStory = () => <Button onClick={action('clicked')}>solo</Button>;

soloStory.story = {
  name: 'solo story',
};
