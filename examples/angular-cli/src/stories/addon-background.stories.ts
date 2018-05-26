import { moduleMetadata, storiesOf } from '@storybook/angular';
import { Button } from '@storybook/angular/demo';
import backgrounds from '@storybook/addon-backgrounds';
import { AppComponent } from '../app/app.component';

storiesOf('Addon|Background', module)
  .addDecorator(
    backgrounds([
      { name: 'twitter', value: '#00aced', default: true },
      { name: 'facebook', value: '#3b5998' },
    ])
  )
  .add('background component', () => ({
    component: AppComponent,
    props: {},
  }));

storiesOf('Addon|Background', module)
  .addDecorator(
    moduleMetadata({
      declarations: [Button],
    })
  )
  .addDecorator(
    backgrounds([
      { name: 'twitter', value: '#00aced', default: true },
      { name: 'facebook', value: '#3b5998' },
    ])
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
