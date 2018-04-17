import { uselessMixin } from './useless-mixin';

export const separatedButton = superClass =>
  class SeparatedButton extends uselessMixin(superClass) {
    static get is() {
      return 'separated-button';
    }

    static get properties() {
      return {
        title: {
          type: String,
          value: 'Click me:',
        },
        counter: {
          type: Number,
          value: 0,
        },
      };
    }

    async handleTap() {
      this.counter += await Promise.resolve(1);
      this.someMethod();
    }
  };
