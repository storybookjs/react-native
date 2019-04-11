import addons from '@storybook/addons';
import deprecate from 'util-deprecate';
import { normalize } from 'upath';
import { ADD_TESTS } from './shared';

const findTestResults = (
  testFiles: string[],
  jestTestResults: { testResults: Array<{ name: string }> },
  jestTestFilesExt: string
) =>
  Object.values(testFiles).map(name => {
    const fileName = `${name}${jestTestFilesExt}`;

    if (jestTestResults && jestTestResults.testResults) {
      const fileNamePattern = new RegExp(fileName);

      return {
        fileName,
        name,
        result: jestTestResults.testResults.find(test =>
          Boolean(normalize(test.name).match(fileNamePattern))
        ),
      };
    }

    return { fileName, name };
  });

const emitAddTests = ({
  kind,
  story,
  testFiles,
  options,
}: {
  kind: string;
  story: () => void;
  testFiles: any;
  options: { results: { testResults: Array<{ name: string }> }; filesExt: string };
}) => {
  addons.getChannel().emit(ADD_TESTS, {
    kind,
    storyName: story,
    tests: findTestResults(testFiles, options.results, options.filesExt),
  });
};

export const withTests = (userOptions: { results: any; filesExt: string }) => {
  const defaultOptions = {
    filesExt: '((\\.specs?)|(\\.tests?))?(\\.js)?$',
  };
  const options = { ...defaultOptions, ...userOptions };

  return (...args: [(string | (() => void)), { kind: string; parameters: { jest?: any } }]) => {
    if (typeof args[0] === 'string') {
      // tslint:disable-next-line:no-shadowed-variable
      return deprecate((storyFn: () => void, { kind }: { kind: string }) => {
        emitAddTests({ kind, story: storyFn, testFiles: args, options });

        return storyFn();
      }, 'Passing component filenames to the `@storybook/addon-jest` via `withTests` is deprecated. Instead, use the `jest` story parameter');
    }

    const [storyFn, { kind, parameters = {} }] = args;
    let { jest: testFiles } = parameters;

    if (typeof testFiles === 'string') {
      testFiles = [testFiles];
    }

    if (testFiles && !testFiles.disable) {
      emitAddTests({ kind, story: storyFn, testFiles, options });
    }

    return storyFn();
  };
};

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
