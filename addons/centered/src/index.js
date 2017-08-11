import ReactCentered from './react';
import VueCentered from './vue';

let Centered = ReactCentered; // default for React
if (window.STORYBOOK_ENV === 'vue') {
  Centered = VueCentered;
}

export default Centered;
