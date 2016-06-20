import { configure, setAddon, addDecorator } from '@kadira/storybook';
import InfoAddon from '../src/';
import centered from '@kadira/react-storybook-decorator-centered';

setAddon(InfoAddon);

configure(function () {
  require('../example/story');
}, module);
