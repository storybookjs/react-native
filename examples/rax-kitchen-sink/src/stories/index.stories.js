import { createElement } from 'rax';
import { storiesOf } from '@storybook/rax';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Button from 'rax-button';
import Text from 'rax-text';

import Welcome from '../App';

// storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onclick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onclick={action('clicked')}>
      <Text role="img" aria-label="so cool">
        😀 😎 👍 💯
      </Text>
    </Button>
  ));
