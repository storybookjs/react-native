import { window } from 'global';
import ReactCentered from './react';
import VueCentered from './vue';
import AngularCentered from './angular';

const Centered = window.STORYBOOK_ENV === 'vue' ? VueCentered : ReactCentered;
export default Centered;

export const ngCentered = AngularCentered;
