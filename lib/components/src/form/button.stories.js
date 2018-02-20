import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';

import Button from './button';

storiesOf('Components|Form/Button', module)
  .addDecorator(withKnobs)
  .add('with onclick', () => <Button onClick={action('click')}>{text('Text', 'Submit')}</Button>);
