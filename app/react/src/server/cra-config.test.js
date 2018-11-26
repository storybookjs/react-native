import fs from 'fs';
import { getReactScriptsPath } from './cra-config';

jest.mock('fs', () => ({
  realpathSync: jest.fn(),
  existsSync: () => true,
}));
jest.mock('mini-css-extract-plugin', () => {});

const SCRIPT_PATH = '.bin/react-scripts';

describe('cra-config', () => {
  beforeEach(() => {
    fs.realpathSync.mockImplementationOnce(() => '/test-project');
  });

  describe('when used with the default react-scripts package', () => {
    beforeEach(() => {
      fs.realpathSync.mockImplementationOnce(path =>
        path.replace(SCRIPT_PATH, `react-scripts/${SCRIPT_PATH}`)
      );
    });

    it('should locate the react-scripts package', () => {
      expect(getReactScriptsPath({ noCache: true })).toEqual(
        '/test-project/node_modules/react-scripts'
      );
    });
  });

  describe('when used with a custom react-scripts package', () => {
    beforeEach(() => {
      fs.realpathSync.mockImplementationOnce(path =>
        path.replace(SCRIPT_PATH, `custom-react-scripts/${SCRIPT_PATH}`)
      );
    });

    it('should locate the react-scripts package', () => {
      expect(getReactScriptsPath({ noCache: true })).toEqual(
        '/test-project/node_modules/custom-react-scripts'
      );
    });
  });
});
