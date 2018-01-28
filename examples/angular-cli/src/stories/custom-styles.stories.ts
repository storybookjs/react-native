import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/angular/demo';

storiesOf('Custom Style', module).add('Default', () => ({
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
}));
