import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { Button } from './Button';

storiesOf('button2', module)
  .add('example2', () => <Button text="test3" onPress={() => null} />)
  .add('example3', () => <Button text="test4" onPress={() => null} />);
