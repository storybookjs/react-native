import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { Button } from './Button';

storiesOf('button', module)
  .add('example', () => <Button text="test" onPress={() => null} />)
  .add('example2', () => <Button text="test2" onPress={() => null} />);
