import { HooksContext } from './hooks';

export {};

declare global {
  // If defining an object you might do something like this
  // interface IConfig { a: number, b: number }

  // Extend the Global interface for the NodeJS namespace.
  namespace NodeJS {
    interface Global {
      // Reference our above type,
      // this allows global.debug to be used anywhere in our code.
      STORYBOOK_HOOKS_CONTEXT: HooksContext;
    }
  }

  // This allows us to simply call debug('some_label')('some debug message')
  // from anywhere in our code.
}
