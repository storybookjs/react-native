import React from 'react';
import { storiesOf } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

import { checkA11y } from '@storybook/addon-a11y';
import BaseButton from '../components/BaseButton';
import DelayedRender from '../components/DelayedRender';

const text = 'Testing the a11y addon';

storiesOf('Addons|a11y', module)
  .addDecorator(checkA11y)
  .addDecorator(fn => {
    setOptions({ selectedAddonPanel: '@storybook/addon-a11y/panel' });
    return fn();
  })
  .add('Default', () => <BaseButton label="" />)
  .add('Label', () => <BaseButton label={text} />)
  .add('Disabled', () => <BaseButton disabled label={text} />)
  .add('Invalid contrast', () => (
    // FIXME has no effect on score
    <BaseButton style={{ color: 'black', backgroundColor: 'black' }} label={text} />
  ))
  .add('delayed render', () => (
    <DelayedRender>
      <BaseButton label="This button has a delayed render of 1s" />
    </DelayedRender>
  ));
