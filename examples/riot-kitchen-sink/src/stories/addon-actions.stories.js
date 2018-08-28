import { storiesOf } from '@storybook/riot';
import { tag2, mount } from 'riot';
import { action } from '@storybook/addon-actions';
import ButtonRaw from './Button.txt';
import { compileNow } from './compileNow';

compileNow(tag2, ButtonRaw);

storiesOf('Addon|Actions', module)
  .add('Action only', () =>
    mount('root', 'my-button', {
      handleClick: action('button-click'),
      content: 'Click me to log the action',
    })
  )
  .add('Multiple actions', () =>
    mount('root', 'my-button', {
      handleDblClick: action('button-double-click'),
      content: 'Double Click me to log the action',
    })
  );
