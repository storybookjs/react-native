import { window } from 'global';
import ReactBackground from './react';
import VueBackground from './vue';

const Background = window.STORYBOOK_ENV === 'vue' ? VueBackground : ReactBackground;

export default Background;
