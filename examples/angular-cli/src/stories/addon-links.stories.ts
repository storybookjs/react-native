import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/angular';
import { Button } from '@storybook/angular/demo';

storiesOf('Another Button', module).add('button with link to another story', () => ({
  component: Button,
  props: {
    text: 'Go to Welcome Story',
    onClick: linkTo('Welcome'),
  },
}));
