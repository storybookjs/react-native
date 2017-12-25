import React from 'react';
import { storiesOf } from '@storybook/react';

import { checkA11y } from '@storybook/addon-a11y';
import BaseButton from '../components/BaseButton';

const text = 'Testing the a11y addon';

storiesOf('Addon a11y', module)
  .addDecorator(checkA11y)
  .add('Default', () => <BaseButton label="" />)
  .add('Label', () => <BaseButton label={text} />)
  .add('Disabled', () => <BaseButton disabled label={text} />)
  .add('Invalid contrast', () => (
    // FIXME has no effect on score
    <BaseButton style={{ color: 'black', backgroundColor: 'black' }} label={text} />
  ));
