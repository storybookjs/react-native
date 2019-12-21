import { document } from 'global';

export default {
  title: 'Custom/Decorator',

  decorators: [
    storyFn => {
      const el = storyFn();
      el.setAttribute('title', `${el.getAttribute('title')} - decorated`);
      return el;
    },
  ],
};

export const ExampleDecoration = () => {
  const el = document.createElement('playground-button');
  el.setAttribute('title', 'An example title');
  return el;
};

ExampleDecoration.story = {
  name: 'example decoration',
};
