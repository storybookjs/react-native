import React from 'react';
import { Story, StoryError } from './Story';
import { Button } from '../Button/Button';

export default {
  title: 'Docs|Story',
  component: Story,
};

const buttonFn = () => <Button secondary>Inline story</Button>;

export const inline = () => <Story inline storyFn={buttonFn} title="hello button" />;

export const error = () => <Story error={StoryError.NO_STORY} />;
