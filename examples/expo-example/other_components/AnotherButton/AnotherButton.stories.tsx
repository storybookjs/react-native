import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { Button } from './AnotherButton';

storiesOf('Another Button', module)
  .add('another button example', () => <Button text="test2" onPress={() => null} />)
  .add('again', () => <Button text="test2" onPress={() => null} />);
