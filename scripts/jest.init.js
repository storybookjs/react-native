import 'jest-enzyme/lib/index';

// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import regeneratorRuntime from 'regenerator-runtime';

import registerRequireContextHook from 'babel-plugin-require-context-hook/register';

registerRequireContextHook();

jest.mock('util-deprecate', () => fn => fn);

// mock console.info calls for cleaner test execution
global.console.info = jest.fn().mockImplementation(() => {});
global.console.debug = jest.fn().mockImplementation(() => {});

// mock local storage calls
const localStorageMock = {
  getItem: jest.fn().mockName('getItem'),
  setItem: jest.fn().mockName('setItem'),
  clear: jest.fn().mockName('clear'),
};
global.localStorage = localStorageMock;
global.regeneratorRuntime = regeneratorRuntime;

configure({ adapter: new Adapter() });

/* Fail tests on PropType warnings
 This allows us to throw an error in tests environments when there are prop-type warnings.
 This should keep the tests free of warnings going forward.
 */

const ignoreList = [
  error => error.message.includes('":nth-child" is potentially unsafe'),
  error => error.message.includes('":first-child" is potentially unsafe'),
  error => error.message.includes('Failed prop type') && error.stack.includes('storyshots'),
];

const throwMessage = (type, message) => {
  const error = new Error(`${type}${message}`);
  if (!ignoreList.reduce((acc, item) => acc || item(error), false)) {
    throw error;
  }
};
const throwWarning = message => throwMessage('warn: ', message);
const throwError = message => throwMessage('error: ', message);

global.console.error = throwError;
global.console.warn = throwWarning;
