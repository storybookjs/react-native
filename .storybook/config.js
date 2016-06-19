import { configure, setAddon } from '@kadira/storybook';
import InfoAddon from '../src/';

setAddon(InfoAddon);

configure(function () {
  require('../src/stories/Story');
}, module);
