import React from 'react';
import { Text } from 'react-native';

import { storiesOf, addDecorator, addParameters } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs } from '@storybook/addon-knobs';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import knobsWrapper from './Knobs';
import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';

addDecorator(withBackgrounds);

addParameters({
  backgrounds: [
    { name: 'dark', value: '#222222' },
    { name: 'white', value: '#ffffff', default: true },
  ],
});

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />, {
  notes: `
# Markdown!\n
* List Item
* [List Item with Link](https://storybook.js.org)
`,
});

storiesOf('Button', module)
  .addParameters({
    backgrounds: [
      { name: 'dark', value: '#222222' },
      { name: 'light', value: '#eeeeee', default: true },
    ],
    notes: `
# Custom note\n
_This component doesn't look right_
`,
  })
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('with text', () => (
    <Button onPress={action('clicked-text')}>
      <Text>Hello Button</Text>
    </Button>
  ))
  .add('with some emoji', () => (
    <Button onPress={action('clicked-emoji')}>
      <Text>😀 😎 👍 💯</Text>
    </Button>
  ));

storiesOf('Knobs', module)
  .addDecorator(withKnobs)
  .add('with knobs', knobsWrapper);

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

addParameters({ globalParameter });

storiesOf('Core|Parameters', module)
  .addParameters({ chapterParameter })
  .add(
    'passed to story',
    ({ parameters }) => <Text>Parameters are {JSON.stringify(parameters)}</Text>,
    {
      storyParameter,
    }
  );
