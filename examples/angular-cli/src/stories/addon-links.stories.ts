import { linkTo } from '@storybook/addon-links';
import { Button } from '@storybook/angular/demo';

export default {
  title: 'Addon/Links',
};

export const buttonWithLinkToAnotherStory = () => ({
  component: Button,
  props: {
    text: 'Go to Welcome Story',
    onClick: linkTo('Welcome'),
  },
});

buttonWithLinkToAnotherStory.story = {
  name: 'button with link to another story',
};
