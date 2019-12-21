import { linkTo } from '@storybook/addon-links';
import { Button } from '@storybook/angular/demo';

export default {
  title: 'Addon/Links',
};

export const ButtonWithLinkToAnotherStory = () => ({
  component: Button,
  props: {
    text: 'Go to Welcome Story',
    onClick: linkTo('Welcome'),
  },
});

ButtonWithLinkToAnotherStory.story = {
  name: 'button with link to another story',
};
