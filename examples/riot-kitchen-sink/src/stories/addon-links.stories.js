import { mount, storiesOf, compileNow } from '@storybook/riot';
import { linkTo } from '@storybook/addon-links';
import ButtonRaw from './Button.txt';

compileNow(ButtonRaw);

storiesOf('Addon|Links', module).add('Go to welcome', () =>
  mount('my-button', {
    rounded: true,
    content: 'This button links to Welcome',
    value: 'with a parameter',
    handleClick: linkTo('Welcome', 'Welcome'),
  })
);
