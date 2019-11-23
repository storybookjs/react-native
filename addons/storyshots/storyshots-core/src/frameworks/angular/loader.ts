import 'core-js';
import 'core-js/es/reflect';
import hasDependency from '../hasDependency';
import configure from '../configure';
import { Loader } from '../Loader';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';

function setupAngularJestPreset() {
  // Needed to prevent "Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten."
  require.requireActual('core-js');
  require.requireActual('core-js/modules/es.promise');
  // require.requireActual('core-js/es6/reflect');
  // require.requireActual('core-js/es7/reflect');

  // Angular + Jest + Storyshots = Crazy Shit:
  // We need to require 'jest-preset-angular/setupJest' before any storybook code
  // is running inside jest -  one of the things that `jest-preset-angular/setupJest` does is
  // extending the `window.Reflect` with all the needed metadata functions, that are required
  // for emission of the TS decorations like 'design:paramtypes'
  require.requireActual('jest-preset-angular/setupJest');
}

function test(options: StoryshotsOptions): boolean {
  return (
    options.framework === 'angular' || (!options.framework && hasDependency('@storybook/angular'))
  );
}

function load(options: StoryshotsOptions) {
  setupAngularJestPreset();

  const storybook = require.requireActual('@storybook/angular');

  configure({ ...options, storybook });

  return {
    framework: 'angular' as const,
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for angular');
    },
    storybook,
  };
}

const angularLoader: Loader = {
  load,
  test,
};

export default angularLoader;
