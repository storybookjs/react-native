import { moduleMetadata, storiesOf } from '@storybook/angular';
import { Button } from '@storybook/angular/demo';

storiesOf('Addon|Background', module)
  .addDecorator(
    moduleMetadata({
      declarations: [Button],
    })
  )
  .add('background template', () => ({
    template: `<storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>`,
    props: {
      text: 'Hello Button',
      onClick: (event: Event) => {
        console.log('some bindings work');
        console.log(event);
      },
    },
  }));
