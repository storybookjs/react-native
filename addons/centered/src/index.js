import { window } from 'global';
import ReactCentered from './react';
import VueCentered from './vue';

const Centered = window.STORYBOOK_ENV === 'vue' ? ReactCentered : VueCentered;

export default Centered;
