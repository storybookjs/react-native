import { storiesOf } from '@storybook/angular';
import { linkTo } from '@storybook/addon-links';

import { Welcome, Button } from '@storybook/angular/demo';
import { AppComponent } from '../app/app.component';

storiesOf('Welcome', module)
  .add('to Storybook', () => ({
    component: Welcome,
    props: {}
  }));

storiesOf('Button', module)
  .add('with text', () => ({
    component: Button,
    props: {
      text: 'Hello Button',
      onClick: () => {}
    }
  }))
  .add('with some emoji', () => ({
    component: Button,
    props: {
      text: '😀 😎 👍 💯',
      onClick: () => {}
    }
  }));

storiesOf('Another Button', module)
  .add('button with link to another story', () => ({
    component: Button,
    props: {
      text: 'Go to Welcome Story',
      onClick: linkTo('Welcome')
    }
  }));

storiesOf('App Component', module)
  .add('Component with separate template', () => ({
    component: AppComponent,
    props: {}
  }));

