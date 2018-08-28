import { storiesOf } from '@storybook/riot';
import { tag2, mount } from 'riot';
import { linkTo } from '@storybook/addon-links';
import ButtonRaw from './Button.txt';
import { compileNow } from './compileNow';

compileNow(tag2, ButtonRaw);

storiesOf('Addon|Links', module).add('Go to welcome', () =>
  mount('root', 'my-button', {
    rounded: true,
    content: 'This button links to Welcome',
    value: 'with a parameter',
    handleClick: linkTo('Welcome', 'Welcome'),
  })
);
