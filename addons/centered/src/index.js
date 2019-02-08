import { window } from 'global';
import deprecate from 'util-deprecate';

import ReactCentered from './react';
import VueCentered from './vue';

// TODO: REMOVE this entire file in V6.0.0

const Centered = deprecate(
  () => (window.STORYBOOK_ENV === 'vue' ? VueCentered : ReactCentered),
  `
  Using "import centered from '@storybook/addon-centered'" is deprecated.
  Please use either:
  "import centered from '@storybook/addon-centered/react'"
  or
  "import centered from '@storybook/addon-centered/vue'"
`
)();

export default Centered;

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
