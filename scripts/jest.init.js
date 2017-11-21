import 'jest-enzyme/lib/index';

// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// mock console.info calls for cleaner test execution
global.console.info = jest.fn().mockImplementation(() => {});

configure({ adapter: new Adapter() });
