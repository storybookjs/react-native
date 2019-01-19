import React from 'react';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered/react';

import BaseButton from '../components/BaseButton';

storiesOf('Addons|Centered', module)
  .addDecorator(centered)
  .add('story 1', () => <BaseButton label="This story should be centered" />);
