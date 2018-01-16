import { storiesOf } from '@storybook/angular';
import { Welcome, Button } from '@storybook/angular/demo';

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
