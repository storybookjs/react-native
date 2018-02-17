import { Injectable } from '@angular/core';

@Injectable()
export class DummyService {
  constructor() {}

  getItems() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(['Joe', 'Jane']);
      }, 2000);
    });
  }
}
