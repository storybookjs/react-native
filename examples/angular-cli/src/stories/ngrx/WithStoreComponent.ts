import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'storybook-comp-with-store',
  template: '<div>{{this.getSotreState()}}</div>',
})
export class WithStoreComponent {
  private store: Store<any>;

  constructor(store: Store<any>) {
    this.store = store;
  }

  getSotreState() {
    return this.store === undefined ? 'Store is NOT injected' : 'Store is injected';
  }
}
