import { createElement } from 'rax';
import { storiesOf } from '@storybook/rax';
import { action } from '@storybook/addon-actions';

import Button from 'rax-button';
import Text from 'rax-text';

storiesOf('Addon|addon-actions', module)
  .add('with text', () => <Button onclick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onclick={action('clicked')}>
      <Text role="img" aria-label="so cool">
        😀 😎 👍 💯
      </Text>
    </Button>
  ));
