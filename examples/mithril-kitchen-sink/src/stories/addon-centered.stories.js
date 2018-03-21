/** @jsx m */

import m from 'mithril';

import { storiesOf } from '@storybook/mithril';
import Centered from '@storybook/addon-centered/mithril';
import Button from '../Button';

storiesOf('Addons|Centered', module)
  .addDecorator(Centered)
  .add('button', () => ({
    view: () => <Button>A button</Button>,
  }));
