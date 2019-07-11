/* eslint-disable react/react-in-jsx-scope */
import { createElement } from 'rax';
import { storiesOf } from '@storybook/rax';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Button from 'rax-button';
import Text from 'rax-text';

import Welcome from './Welcome';

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button', 'with text')} />
));

storiesOf('Button', module)
  .add('with text', () => <Button onPress={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onPress={action('clicked')}>
      <Text role="img" aria-label="so cool">
        😀 😎 👍 💯
      </Text>
    </Button>
  ));
