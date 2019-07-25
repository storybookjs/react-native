import fs from 'fs';
import path from 'path';
import {
  applyCRAWebpackConfig,
  getModulePath,
  getReactScriptsPath,
  getTypeScriptRules,
} from './cra-config';
import mockRules from './__mocks__/mockRules';
import mockConfig from './__mocks__/mockConfig';

jest.mock('fs', () => ({
  realpathSync: jest.fn(() => '/test-project'),
  readFileSync: jest.fn(),
  existsSync: jest.fn(() => true),
}));
jest.mock('mini-css-extract-plugin', () => {});

const SCRIPT_PATH = '.bin/react-scripts';

const stripCwd = (loaderPath: string) => loaderPath.replace(process.cwd(), '');

describe('cra-config', () => {
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

  describe('when used with a custom react-scripts package without symlinks in .bin folder', () => {
    beforeEach(() => {
      // In case of .bin/react-scripts is not symlink (like it happens on Windows),
      // realpathSync() method does not translate the path.
      fs.realpathSync.mockImplementationOnce(filePath => filePath);

      fs.readFileSync.mockImplementationOnce(
        () => `#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case \`uname\` in
    *CYGWIN*) basedir=\`cygpath -w "$basedir"\`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../custom-react-scripts/bin/react-scripts.js" "$@"
  ret=$?
else
  node  "$basedir/../custom-react-scripts/bin/react-scripts.js" "$@"
  ret=$?
fi
exit $ret`
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
      const rules = getTypeScriptRules(mockRules, './.storybook');
      expect(rules.length).toBe(2);
    });

    // Allows using TypeScript in the `.storybook` (or config) folder.
    it('should add the Storybook config directory to `include` for all TS related rules', () => {
      const rules = getTypeScriptRules(mockRules, './.storybook');
      expect(
        rules.every(rule => rule.include.find(filePath => filePath.includes('.storybook')))
      ).toBe(true);
    });

    it('should get the baseUrl from a tsconfig.json', () => {
      jest.spyOn(path, 'join').mockImplementation(() => 'project/tsconfig.json');
      jest.mock(
        'project/tsconfig.json',
        () => ({
          compilerOptions: {
            baseUrl: 'src',
          },
        }),
        { virtual: true }
      );
      expect(getModulePath()).toEqual('src');
      path.join.mockRestore();
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
      const webpackConfig = applyCRAWebpackConfig(mockConfig, '/test-project');
      // We don't want full paths in snapshots.
      webpackConfig.resolveLoader.modules = webpackConfig.resolveLoader.modules.map(stripCwd);
      expect(webpackConfig).toMatchSnapshot();
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
      const webpackConfig = applyCRAWebpackConfig(mockConfig, '/test-project');
      // We don't want full paths in snapshots.
      webpackConfig.resolveLoader.modules = webpackConfig.resolveLoader.modules.map(stripCwd);
      expect(webpackConfig).toMatchSnapshot();
    });
  });
});
