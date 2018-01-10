import { storiesOf } from '@storybook/angular';
import { linkTo } from '@storybook/addon-links';

import { Welcome, Button } from '@storybook/angular/demo';
import { AppComponent } from '../app/app.component';

storiesOf('Welcome', module).add('to Storybook', () => ({
  component: Welcome,
  props: {},
}));

storiesOf('Button', module)
  .add('with text', () => ({
    moduleMetadata: {
      entryComponents: [Button, Welcome],
      declarations: [Button, Welcome],
    },
    props: {
      text: 'Hello Button',
      onClick: event => {
        console.log('some bindings work');
        console.log(event);
      },
    },
    template: `
      <h1> This is a template </h1>
      <storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>
      <storybook-welcome-component></storybook-welcome-component>
    `,
  }))
  .add('with some emoji', () => ({
    component: Button,
    props: {
      text: '😀 😎 👍 💯',
      onClick: () => {},
    },
  }));

storiesOf('Another Button', module).add('button with link to another story', () => ({
  component: Button,
  props: {
    text: 'Go to Welcome Story',
    onClick: linkTo('Welcome'),
  },
}));

storiesOf('App Component', module).add('Component with separate template', () => ({
  component: AppComponent,
  props: {},
}));
