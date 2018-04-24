import { document } from 'global';
import { storiesOf } from '@storybook/html';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { subscriptionsStore } from '@storybook/core/client';

import './welcome.css';
import welcome from './welcome.html';

// TODO move to addon-links
const linkSubscribtion = () => {
  const listener = e => {
    const { sbKind, sbStory } = e.target.dataset;
    if (sbKind || sbStory) {
      e.preventDefault();
      linkTo(sbKind, sbStory)();
    }
  };

  document.addEventListener('click', listener);
  return () => document.removeEventListener('click', listener);
};

storiesOf('Welcome', module)
  .addDecorator(story => {
    subscriptionsStore.register(linkSubscribtion);
    return story();
  })
  .add('Welcome', () => welcome);

storiesOf('Demo', module)
  .add('heading', () => '<h1>Hello World</h1>')
  .add('button', () => {
    const button = document.createElement('button');
    button.innerHTML = 'Hello Button';
    button.addEventListener('click', action('Click'));
    return button;
  });
