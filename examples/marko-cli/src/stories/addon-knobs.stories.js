/** @jsx m */

import { storiesOf } from '@storybook/marko';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  text,
  number,
  boolean,
  array,
  select,
  color,
  date,
  button,
} from '@storybook/addon-knobs/marko';
import Hello from '../components/hello/index.marko';

storiesOf('Addons|Knobs', module)
  .addDecorator(withKnobs)
  .add('Simple', () => {
    const name = text('Name', 'John Doe');
    const age = number('Age', 44);
    return Hello.renderSync({
      name: text('Name', 'John Doe'),
      age: number('Age', 44)
    })
  });
