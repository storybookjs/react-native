// import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { Text } from 'react-native';
import Button from '.';
// import CenterView from '../CenterView';

storiesOf('Button', module)
  .add('with text', () => {
    // console.log('s');
    return (
      <Button onPress={() => null}>
        <Text>Hello Button!!!</Text>
      </Button>
    );
  })
  .add('with some emoji', () => (
    <Button onPress={() => null}>
      <Text>😀 😎 👍 💯 🤘</Text>
    </Button>
  ));
//   .addParameters({
//     component: Button,
//   })
//   .addParameters({
//     backgrounds: [
//       { name: 'dark', value: '#222222' },
//       { name: 'light', value: '#eeeeee', default: true },
//     ],
//     notes: `
// # Custom note\n
// _This component doesn't look right_
// `,
//   })
//   .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
// .add('with some emoji', () => (
//   <Button onPress={action('clicked-emoji')}>
//     <Text>😀 😎 👍 💯 🤘</Text>
//   </Button>
// ));
