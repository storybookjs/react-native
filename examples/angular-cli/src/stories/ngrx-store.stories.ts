import { StoreModule } from '@ngrx/store';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { WithStoreComponent } from './ngrx/WithStoreComponent';

storiesOf('ngrx|Store', module)
  .addDecorator(
    moduleMetadata({
      imports: [StoreModule.forRoot({})],
      declarations: [WithStoreComponent],
    })
  )
  .add('With component', () => ({
    component: WithStoreComponent,
  }))
  .add('With template', () => ({
    template: `<storybook-comp-with-store></storybook-comp-with-store>`,
  }));
