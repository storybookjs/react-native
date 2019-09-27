import React from 'react';
import { Story, StoryError } from './Story';
import { Button } from '../Button/Button';

export default {
  title: 'Docs|Story',
  component: Story,
};

const buttonFn = () => <Button secondary>Inline story</Button>;

const buttonHookFn = () => {
  const [count, setCount] = React.useState(0);
  return (
    <Button secondary onClick={() => setCount(count + 1)}>
      {`count: ${count}`}
    </Button>
  );
};

export const inline = () => <Story inline storyFn={buttonFn} title="hello button" />;

export const error = () => <Story error={StoryError.NO_STORY} />;

export const reactHook = () => <Story inline storyFn={buttonHookFn} title="hello button" />;
