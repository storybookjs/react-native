import { storiesOf } from '@storybook/angular';

import { addonNotes } from '@storybook/addon-notes';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Welcome, Button } from '@storybook/angular/demo';

import { AppComponent } from '../app/app.component';

storiesOf('Welcome')
  .add('to Storybook', () => ({
    component: Welcome,
    props: {}
  }))

storiesOf('Button')
  .add('with text', () => ({
    component: Button,
    props: {
      text: 'Hello Button'
    }
  }))
  .add('with some emoji', addonNotes({ notes: 'My notes on a button with emojis' })(() => ({
    component: Button,
    props: {
      text: '😀 😎 👍 💯'
    }
  })))
  .add('with some emoji and action', addonNotes({ notes: 'My notes on a button with emojis' })(() => ({
    component: Button,
    props: {
      text: '😀 😎 👍 💯',
      onClick: action('This was clicked OMG')
    }
  })))

storiesOf('Another Button')
  .add('button with link to another story', () => ({
    component: Button,
    props: {
      text: 'Go to Welcome Story',
      onClick: linkTo('Welcome')
    }
  }))

storiesOf('App Component')
  .add('the whole app', () => ({
    component: AppComponent,
    props: {}
  }))
