import { storiesOf } from '@storybook/polymer';
import { document } from 'global';

storiesOf('Custom|Decorator', module)
  .addDecorator(fn => {
    const el = fn();
    el.setAttribute('title', `${el.getAttribute('title')} - decorated`);
    return el;
  })
  .add('example decoration', () => {
    const el = document.createElement('playground-button');
    el.setAttribute('title', 'An example title');
    return el;
  });
