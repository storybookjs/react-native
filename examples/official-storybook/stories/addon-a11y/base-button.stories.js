import React from 'react';
import BaseButton from '../../components/BaseButton';
import DelayedRender from '../../components/DelayedRender';

const text = 'Testing the a11y addon';

export default {
  title: 'Addons|A11y/BaseButton',
  component: BaseButton,
  parameters: {
    options: { selectedPanel: 'storybook/a11y/panel' },
    edit: {
      fileName:
        'https://github.com/storybookjs/storybook/blob/next/lib/components/src/Button/Button.tsx',
    },
  },
};

export const Default = () => <BaseButton label="" />;
export const Label = () => <BaseButton label={text} />;
export const Disabled = () => <BaseButton disabled label={text} />;

export const invalidContrast = () => (
  // FIXME: has no effect on score
  <BaseButton style={{ color: 'black', backgroundColor: 'black' }} label={text} />
);
invalidContrast.story = {
  name: 'Invalid contrast',
};

export const delayedRender = () => (
  <DelayedRender>
    <BaseButton label="This button has a delayed render of 1s" />
  </DelayedRender>
);
delayedRender.story = {
  name: 'delayed render',
};
