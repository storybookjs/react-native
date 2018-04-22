import { document } from 'global';
import { storiesOf } from '@storybook/html';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import './welcome.css';
import welcome from './welcome.html';

document.addEventListener('click', e => {
  const { kind, story } = e.target.dataset;
  if (kind || story) {
    e.preventDefault();
    linkTo(kind, story)();
  }
});

storiesOf('Welcome', module).add('Welcome', () => welcome);

storiesOf('Demo', module)
  .add('heading', () => '<h1>Hello World</h1>')
  .add('button', () => {
    const button = document.createElement('button');
    button.innerText = 'Hello Button';
    button.addEventListener('click', action('Click'));
    return button;
  });
