import { window } from 'global';
import ReactCentered from './react';
import VueCentered from './vue';

function getCentered(env) {
  switch (env) {
    case 'vue':
      return VueCentered;
    default:
      return ReactCentered;
  }
}

const Centered = getCentered(window.STORYBOOK_ENV);

export default Centered;
