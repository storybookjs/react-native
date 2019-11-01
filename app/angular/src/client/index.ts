export {
  storiesOf,
  setAddon,
  addDecorator,
  addParameters,
  configure,
  getStorybook,
  forceReRender,
  raw,
} from './preview';

export { moduleMetadata } from './preview/angular/decorators';

// tsc wants to use NodeModule instead of WebpackModule
declare const module: any;
if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
