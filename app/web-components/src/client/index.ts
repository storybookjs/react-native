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

export {
  getCustomElements,
  setCustomElements,
  isValidComponent,
  isValidMetaData,
} from './customElements';

// TODO: disable HMR and do full page loads because of customElements.define
if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
