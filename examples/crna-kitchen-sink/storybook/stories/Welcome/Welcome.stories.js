import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react-native';
import React from 'react';
import Welcome from '.';

storiesOf('Welcome', module)
  .addParameters({
    component: Welcome,
  })
  .add('to Storybook', () => <Welcome showApp={linkTo('Button')} />, {
    notes: `
# Markdown!\n
* List Item
* [List Item with Link](https://storybook.js.org)
`,
  });
