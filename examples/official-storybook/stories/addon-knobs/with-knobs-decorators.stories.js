import { withKnobs, text } from '@storybook/addon-knobs';

export default {
  title: 'Addons|Knobs.with decorators',
};

export const withDecoratorCallingStoryFunctionMoreThanOnce = () => {
  return text('Text', 'Hello');
};
withDecoratorCallingStoryFunctionMoreThanOnce.story = {
  decorators: [
    withKnobs,
    storyFn => {
      storyFn();
      return storyFn();
    },
  ],
};
