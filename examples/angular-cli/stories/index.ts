import { storiesOf } from '@storybook/angular';

import { addonNotes } from '@storybook/addon-notes';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Welcome, Button } from '@storybook/angular/demo';

import { AppComponent } from '../src/app/app.component';

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

storiesOf('Another Button', module)
  .add('button with link to another story', () => ({
    component: Button,
    props: {
      text: 'Go to Welcome Story',
      onClick: linkTo('Welcome')
    }
  }))

storiesOf('App Component', module)
  .add('the whole app', () => ({
    component: AppComponent,
    props: {}
  }))

storiesOf('Addon Actions', module)
  .add('Action only', () => ({
    component: Button,
    props: {
      text: 'Action only',
      onClick: action('log 1')
    }
  }))
  .add('Action and method', () => ({
    component: Button,
    props: {
      text: 'Action and Method',
      onClick: e => {
        console.log(e);
        e.preventDefault();
        action('log2')(e.target);
      }
    }
  }));

storiesOf('Addon Notes', module)
  .add(
    'Simple note',
    addonNotes({ notes: 'My notes on some button' })(() => ({
      component: Button,
      props: {
        text: 'Notes on some Button'
      }
    }))
  )
  .add(
    'Note with HTML',
    addonNotes({
      notes: `
      <h2>My notes on emojis</h2>

      <em>It's not all that important to be honest, but..</em>

      Emojis are great, I love emojis, in fact I like using them in my Component notes too! 😇
    `,
    })(() => ({
      component: Button,
      props: {
        text: 'Notes with HTML'
      }
    }))
  );
