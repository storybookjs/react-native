import fs from 'fs';
import path from 'path';
import { getReactScriptsPath, getTypeScriptRules, applyCRAWebpackConfig } from './cra-config';
import mockRules from './__mocks__/mockRules';
import mockConfig from './__mocks__/mockConfig';

jest.mock('fs', () => ({
  realpathSync: jest.fn(),
  existsSync: () => true,
}));
jest.mock('mini-css-extract-plugin', () => {});

const SCRIPT_PATH = '.bin/react-scripts';

describe('cra-config', () => {
  beforeEach(() => {
    fs.realpathSync.mockReset();
    fs.realpathSync.mockImplementationOnce(() => '/test-project');
  });

  describe('when used with the default react-scripts package', () => {
    beforeEach(() => {
      fs.realpathSync.mockImplementationOnce(filePath =>
        filePath.replace(SCRIPT_PATH, `react-scripts/${SCRIPT_PATH}`)
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
      fs.realpathSync.mockImplementationOnce(filePath =>
        filePath.replace(SCRIPT_PATH, `custom-react-scripts/${SCRIPT_PATH}`)
      );
    });

    it('should locate the react-scripts package', () => {
      expect(getReactScriptsPath({ noCache: true })).toEqual(
        '/test-project/node_modules/custom-react-scripts'
      );
    });
  });

  describe('when used with TypeScript', () => {
    it('should return the correct config', () => {
      // Normalise the return, as we know our new rules object will be an array, whereas a string is expected.
      const rules = getTypeScriptRules(mockRules, './.storybook');
      const rulesObject = { ...rules[0], include: rules[0].include[0] };
      expect(rulesObject).toMatchObject(mockRules[2].oneOf[1]);
    });

    // Allows using TypeScript in the `.storybook` (or config) folder.
    it('should add the Storybook config directory to `include`', () => {
      const rules = getTypeScriptRules(mockRules, './.storybook');
      expect(rules[0].include.findIndex(string => string.includes('.storybook'))).toEqual(1);
    });
  });

  describe('when used with react-scripts < 2.1.0', () => {
    beforeEach(() => {
      fs.realpathSync.mockImplementationOnce(() =>
        path.join(__dirname, '__mocks__/react-scripts-2-0-0/sub1/sub2')
      );
      getReactScriptsPath({ noCache: true });
    });

    it('should apply styling webpack rules', () => {
      expect(applyCRAWebpackConfig(mockConfig, '/test-project')).toMatchSnapshot();
    });
  });

  describe('when used with react-scripts >= 2.1.0', () => {
    beforeEach(() => {
      fs.realpathSync.mockImplementationOnce(() =>
        path.join(__dirname, '__mocks__/react-scripts-2-1-0/sub1/sub2')
      );
      getReactScriptsPath({ noCache: true });
    });

    it('should apply Babel, styling rules and merge plugins', () => {
      expect(applyCRAWebpackConfig(mockConfig, '/test-project')).toMatchSnapshot();
    });
  });
});
