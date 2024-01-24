import { storiesOf } from '@storybook/react-native/V6';
import { text } from '@storybook/addon-knobs';
import { withKnobs } from '@storybook/addon-ondevice-knobs';
import React from 'react';
import { Button } from './AnotherButton';

storiesOf('Another Button', module)
  .addDecorator(withKnobs)
  .add('another button example', () => <Button text={text('text', 'test2')} onPress={() => null} />)
  .add('again', () => <Button text={text('text', 'text2')} onPress={() => null} />);
