import loaderReact from './react/loader';
import loaderRn from './rn/loader';
import loaderAngular from './angular/loader';
import loaderVue from './vue/loader';

const loaders = [loaderReact, loaderAngular, loaderRn, loaderVue];

function loadFramework(options) {
  const loader = loaders.find(frameworkLoader => frameworkLoader.test(options));

  if (!loader) {
    throw new Error('storyshots is intended only to be used with storybook');
  }

  return loader.load(options);
}

export default loadFramework;
