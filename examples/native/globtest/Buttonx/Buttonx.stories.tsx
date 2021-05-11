import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { Button } from './Buttonx';

storiesOf('buttonx', module)
  .add('examplex', () => <Button text="test" onPress={() => null} />)
  .add('example2x', () => <Button text="test2" onPress={() => null} />)
  .add('example3x', () => <Button text="test3" onPress={() => null} />);
