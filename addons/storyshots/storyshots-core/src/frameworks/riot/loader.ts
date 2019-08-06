import global from 'global';
import hasDependency from '../hasDependency';
import configure from '../configure';
import { Loader } from '../Loader';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';

function mockRiotToIncludeCompiler() {
  jest.mock('riot', () => require.requireActual('riot/riot.js'));
}

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'riot' || (!options.framework && hasDependency('@storybook/riot'));
}

function load(options: StoryshotsOptions) {
  global.STORYBOOK_ENV = 'riot';
  mockRiotToIncludeCompiler();

  const { configPath, config } = options;
  const storybook = require.requireActual('@storybook/riot');

  configure({ configPath, config, storybook });

  return {
    framework: 'riot' as const,
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for riot');
    },
    storybook,
  };
}

const riotLoader: Loader = {
  load,
  test,
};

export default riotLoader;
