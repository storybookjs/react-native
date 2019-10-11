import { Injectable } from '@angular/core';

@Injectable()
export class DummyService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, no-useless-constructor
  constructor() {}

  getItems() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(['Joe', 'Jane']);
      }, 2000);
    });
  }
}
