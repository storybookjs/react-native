export const uselessMixin = superClass =>
  class UselessMixin extends superClass {
    constructor() {
      super();

      this.eventType = 'test';
    }

    someMethod() {
      this.dispatchEvent(new CustomEvent(this.eventType, { detail: 'test' }));
    }
  };
