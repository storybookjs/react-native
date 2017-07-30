import { document } from 'global';
import renderStorybookUI from '../../src/index';
import Provider from './provider';

const rootEl = document.getElementById('root');
renderStorybookUI(rootEl, new Provider());
