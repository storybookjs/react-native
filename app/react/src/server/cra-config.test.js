import fs from 'fs';
import { getReactScriptsPath, getTypeScriptRules } from './cra-config';
import mockRules from './__mocks__/mockRules';

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

  describe('when used with TypeScript', () => {
    const rules = getTypeScriptRules(mockRules, './.storybook');

    it('should return the correct config', () => {
      // Normalise the return, as we know our new rules object will be an array, whereas a string is expected.
      const rulesObject = { ...rules[0], include: rules[0].include[0] };
      expect(rulesObject).toMatchObject(mockRules[2].oneOf[1]);
    });

    // Allows using TypeScript in the `.storybook` (or config) folder.
    it('should add the Storybook config directory to `include`', () => {
      expect(rules[0].include.findIndex(string => string.includes('.storybook'))).toEqual(1);
    });
  });
});
