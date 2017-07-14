import { storiesOf } from '@storybook/angular';

import { Welcome, Button } from '@storybook/angular/demo';

storiesOf('Welcome', module)
  .add('to Storybook', () => ({
    component: Welcome,
    props: {}
  }))

storiesOf('Button', module)
  .add('with text', () => ({
    component: Button,
    props: {
      text: 'Hello Button'
    }
  }))
  .add('with some emoji', () => ({
    component: Button,
    props: {
      text: '😀 😎 👍 💯'
    }
  }))
