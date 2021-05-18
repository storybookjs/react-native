import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Button } from './Button';

const testing = () => {
  const timeout = new Promise((resolve) => {
    setTimeout(() => {
      resolve('hi');
    }, 1000);
  });
  timeout
    .then((res) => {
      console.log(res);
    })
    .finally(() => {
      console.log('resolved ');
    });
};

storiesOf('button promise', module)
  .add('finally', () => <Button text="Do a promise" onPress={testing} />)
  .add('nothing', () => <Button text="test4" onPress={() => null} />);
