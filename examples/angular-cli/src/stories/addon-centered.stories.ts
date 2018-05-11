import { centeredAng } from '@storybook/addon-centered';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { Button } from '@storybook/angular/demo';
import { AppComponent } from '../app/app.component';

storiesOf('Addon|Centered', module)
  .addDecorator(centeredAng)
  .add('centered component', () => ({
    component: AppComponent,
    props: {},
  }));

storiesOf('Addon|Centered', module)
  .addDecorator(
    moduleMetadata({
      declarations: [Button],
    })
  )
  .addDecorator(centeredAng)
  .add('centered template', () => ({
    template: `<storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>`,
    props: {
      text: 'Hello Button',
      onClick: event => {
        console.log('some bindings work');
        console.log(event);
      },
    },
  }));
