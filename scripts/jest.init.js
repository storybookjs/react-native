import 'jest-enzyme/lib/index';

// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// mock console.info calls for cleaner test execution
global.console.info = jest.fn().mockImplementation(() => {});

configure({ adapter: new Adapter() });

/* Fail tests on PropType warnings
 This allows us to throw an error in tests environments when there are prop-type warnings. This should keep the tests
 free of warnings going forward.
 */

/* const throwError = message => {
  throw new Error(message);
};

global.console.error = throwError;
global.console.warn = throwError; */
