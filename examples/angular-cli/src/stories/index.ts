import { storiesOf } from '@storybook/angular';
import { Welcome, Button } from '@storybook/angular/demo';
import { moduleMetadata } from '@storybook/angular';

storiesOf('Welcome', module).add('to Storybook', () => ({
  template: `<storybook-welcome-component></storybook-welcome-component>`,
  props: {},
  moduleMetadata: {
    declarations: [Welcome],
  },
}));

storiesOf('Button', module)
  .addDecorator(
    moduleMetadata({
      declarations: [Button],
    })
  )
  .add('with text', () => ({
    template: `<storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>`,
    props: {
      text: 'Hello Button',
      onClick: event => {
        console.log('some bindings work');
        console.log(event);
      },
    },
  }))
  .add('with some emoji', () => ({
    template: `<storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>`,
    props: {
      text: '😀 😎 👍 💯',
      onClick: () => {},
    },
  }));
