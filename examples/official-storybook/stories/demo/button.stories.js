import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';

export default {
  title: 'Other/Demo/Button',
  component: Button,
  id: 'demo-button-id',
  parameters: {
    docs: {
      inlineStories: false,
    },
  },
};

export const WithText = () => <Button onClick={action('clicked')}>Hello Button</Button>;
WithText.story = {
  name: 'with text',
};

export const WithSomeEmoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
WithSomeEmoji.story = {
  name: 'with some emoji',
};

export const WithCounter = () => {
  const [counter, setCounter] = useState(0);
  const label = `Testing: ${counter}`;
  return <Button onClick={() => setCounter(counter + 1)}>{label}</Button>;
};

WithCounter.story = {
  name: 'with counter',
  parameters: {
    docs: {
      storyDescription: 'This demonstrates react hooks working inside stories. Go team! 🚀',
    },
  },
};
