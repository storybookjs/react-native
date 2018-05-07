import { document } from 'global';
import { storiesOf } from '@storybook/html';
import { action } from '@storybook/addon-actions';
import { withLinks } from '@storybook/addon-links';

import './welcome.css';
import welcome from './welcome.html';

storiesOf('Welcome', module)
  .addDecorator(withLinks)
  .add('Welcome', () => welcome);

storiesOf('Demo', module)
  .add('heading', () => '<h1>Hello World</h1>')
  .add(
    'headings',
    () => '<h1>Hello World</h1><h2>Hello World</h2><h3>Hello World</h3><h4>Hello World</h4>'
  )
  .add('button', () => {
    const button = document.createElement('button');
    button.innerHTML = 'Hello Button';
    button.addEventListener('click', action('Click'));
    return button;
  });
