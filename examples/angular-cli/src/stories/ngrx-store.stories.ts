import { Store, StoreModule } from '@ngrx/store';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { Component } from '@angular/core';

@Component({
  selector: 'storybook-comp-with-store',
  template: '<div>{{this.getStoreState()}}</div>',
})
class WithStoreComponent {
  private store: Store<any>;

  constructor(store: Store<any>) {
    this.store = store;
  }

  getStoreState() {
    return this.store === undefined ? 'Store is NOT injected' : 'Store is injected';
  }
}

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
