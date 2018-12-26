import interpret from 'interpret';
import { logger } from '@storybook/node-logger';
import { getInterpretedFileWithExt } from './interpret-files';

// The code based on https://github.com/webpack/webpack-cli/blob/ca504de8c7c0ea66278021b72fa6a953e3ffa43c/bin/convert-argv

const compilersState = new Map();

function registerCompiler(moduleDescriptor) {
  if (!moduleDescriptor) {
    return 0;
  }

  const state = compilersState.get(moduleDescriptor);

  if (state !== undefined) {
    return state;
  }

  if (typeof moduleDescriptor === 'string') {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    require(moduleDescriptor);
    compilersState.set(moduleDescriptor, 1);
    return 1;
  }

  if (!Array.isArray(moduleDescriptor)) {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    moduleDescriptor.register(require(moduleDescriptor.module));
    compilersState.set(moduleDescriptor, 1);
    return 1;
  }

  let registered = 0;

  for (let i = 0; i < moduleDescriptor.length; i += 1) {
    try {
      registered += registerCompiler(moduleDescriptor[i]);
      break;
    } catch (e) {
      // do nothing
    }
  }

  compilersState.set(moduleDescriptor, registered);
  return registered;
}

function interopRequireDefault(filePath) {
  // eslint-disable-next-line import/no-dynamic-require,global-require
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

export default function serverRequire(filePath) {
  const paths = Array.isArray(filePath) ? filePath : [filePath];
  const existingCandidate = getCandidate(paths);

  if (!existingCandidate) {
    return null;
  }

  const { path: candidatePath, ext: candidateExt } = existingCandidate;

  const moduleDescriptor = interpret.extensions[candidateExt];

  // The "moduleDescriptor" either "undefined" or "null". The warning isn't needed in these cases.
  if (moduleDescriptor && registerCompiler(moduleDescriptor) === 0) {
    logger.warn(`=> File ${candidatePath} is detected`);
    logger.warn(`   but impossible to import loader for ${candidateExt}`);

    return null;
  }

  return interopRequireDefault(candidatePath);
}
