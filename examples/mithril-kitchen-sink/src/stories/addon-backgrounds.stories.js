/** @jsx m */

import m from 'mithril';
import BaseButton from '../BaseButton';

export default {
  title: 'Addons/Backgrounds',
  parameters: {
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  },
};

export const Story1 = () => ({
  view: () => <BaseButton label="You should be able to switch backgrounds for this story" />,
});
Story1.story = { name: 'story 1' };

export const Story2 = () => ({
  view: () => <BaseButton label="This one too!" />,
});
Story2.story = { name: 'story 2' };
