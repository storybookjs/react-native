import React from 'react';
import { addDecorator, storiesOf } from '@storybook/react-native';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { Text } from 'react-native';

// Remember to also include '@storybook/addon-ondevice-backgrounds' in your addons config: see /examples/native/.storybook/main.js
addDecorator(withBackgrounds);

storiesOf('Background StoriesOf', module)
  .addParameters({
    backgrounds: [
      { name: 'warm', value: 'hotpink', default: true },
      { name: 'cool', value: 'deepskyblue' },
    ],
  })
  .add('Basic', () => <Text>Change background color via Addons -&gt; Background</Text>);
