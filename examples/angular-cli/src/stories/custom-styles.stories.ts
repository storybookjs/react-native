import { moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';
import { Button } from '@storybook/angular/demo';

export default {
  title: 'Custom/Style',
  decorators: [
    moduleMetadata({
      declarations: [Button],
    }),
  ],
};

export const defaultStory = () => ({
  template: `<storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>`,
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
});

defaultStory.story = {
  name: 'Default',
};

export const withKnobsStory = () => ({
  template: `<storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>`,
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
});

withKnobsStory.story = {
  name: 'With Knobs',
  decorators: [withKnobs],
};
