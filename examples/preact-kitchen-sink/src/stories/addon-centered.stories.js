/** @jsx h */

import { h } from 'preact';

import { storiesOf } from '@storybook/preact';
import Centered from '@storybook/addon-centered/preact';
import Button from '../Button';

storiesOf('Addons|Centered', module)
  .addDecorator(Centered)
  .add('Button', () => <Button>A button</Button>);
