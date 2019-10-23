import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';

export default {
  title: 'Other|Demo/Button',
  component: Button,
  parameters: {
    docs: {
      inlineStories: false,
    },
  },
};

export const withText = () => <Button onClick={action('clicked')}>Hello Button</Button>;
withText.story = {
  name: 'with text',
};

export const withSomeEmoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
withSomeEmoji.story = {
  name: 'with some emoji',
};

export const withCounter = () => {
  const [counter, setCounter] = useState(0);
  const label = `Testing: ${counter}`;
  return <Button onClick={() => setCounter(counter + 1)}>{label}</Button>;
};

withCounter.story = {
  name: 'with counter',
  parameters: {
    docs: {
      storyDescription: 'This demonstrates react hooks working inside stories. Go team! 🚀',
    },
  },
};
