import loaderReact from './react/loader';
import loaderRn from './rn/loader';
import loaderAngular from './angular/loader';

const loaders = [loaderReact, loaderAngular, loaderRn];

function loadFramework(options) {
  const loader = loaders.find(frameworkLoader => frameworkLoader.test(options));

  if (!loader) {
    throw new Error('storyshots is intended only to be used with storybook');
  }

  return loader.load(options);
}

export default loadFramework;
