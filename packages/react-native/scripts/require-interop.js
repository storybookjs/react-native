const fs = require('fs');

const boost = new Set(['.js', '.jsx', '.ts', '.tsx', '.cts', '.mts', '.cjs', '.mjs']);

function sortExtensions() {
  return [...Array.from(boost)];
}

const possibleExtensions = sortExtensions();
function getInterpretedFileWithExt(pathToFile) {
  return possibleExtensions
    .map((ext) => ({ path: pathToFile.endsWith(ext) ? pathToFile : `${pathToFile}${ext}`, ext }))
    .find((candidate) => fs.existsSync(candidate.path));
}

let registered = false;

function interopRequireDefault(filePath) {
  const hasEsbuildBeenRegistered = !!require('module')._extensions['.ts'];

  if (registered === false && !hasEsbuildBeenRegistered) {
    const { register } = require('esbuild-register/dist/node');
    registered = true;
    register({
      target: `node${process.version.slice(1)}`,
      format: 'cjs',
      hookIgnoreNodeModules: true,
      // Some frameworks, like Stylus, rely on the 'name' property of classes or functions
      // https://github.com/storybookjs/storybook/issues/19049
      keepNames: true,
      tsconfigRaw: `{
      "compilerOptions": {
        "strict": false,
        "skipLibCheck": true,
      },
    }`,
    });
  }

  const result = require(filePath);

  const isES6DefaultExported =
    typeof result === 'object' && result !== null && typeof result.default !== 'undefined';

  return isES6DefaultExported ? result.default : result;
}

function getCandidate(paths) {
  for (let i = 0; i < paths.length; i += 1) {
    const candidate = getInterpretedFileWithExt(paths[i]);

    if (candidate) {
      return candidate;
    }
  }

  return undefined;
}

function serverRequire(filePath) {
  const candidatePath = serverResolve(filePath);

  if (!candidatePath) {
    return null;
  }

  return interopRequireDefault(candidatePath);
}

function serverResolve(filePath) {
  const paths = Array.isArray(filePath) ? filePath : [filePath];
  const existingCandidate = getCandidate(paths);

  if (!existingCandidate) {
    return null;
  }

  return existingCandidate.path;
}

module.exports = {
  serverRequire,
  serverResolve,
};
