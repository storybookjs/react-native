import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs/angular';
import { Button } from '@storybook/angular/demo';

storiesOf('Custom Style', module)
  .add('Default', () => ({
    template: `<storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>`,
    moduleMetadata: {
      declarations: [Button],
    },
    props: {
      text: 'Button with custom styles',
      onClick: action('log'),
    },
    styles: [
      `
      storybook-button-component {
        background-color: yellow;
        padding: 25px;
      }
    `,
    ],
  }))
  .addDecorator(withKnobs)
  .add('With Knobs', () => ({
    template: `<storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>`,
    moduleMetadata: {
      declarations: [Button],
    },
    props: {
      text: text('text', 'Button with custom styles'),
      onClick: action('log'),
    },
    styles: [
      `
      storybook-button-component {
        background-color: red;
        padding: 25px;
      }
    `,
    ],
  }));
