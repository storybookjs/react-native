/** @jsx m */

import m from 'mithril';

import { storiesOf } from '@storybook/mithril';

import BaseButton from '../BaseButton';

storiesOf('Addons|Backgrounds', module)
  .addParameters({
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  })
  .add('story 1', () => ({
    view: () => <BaseButton label="You should be able to switch backgrounds for this story" />,
  }))
  .add('story 2', () => ({
    view: () => <BaseButton label="This one too!" />,
  }));
