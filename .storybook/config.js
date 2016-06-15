import { configure } from '@kadira/storybook';

configure(function () {
  require('../src/styles.css');
  require('../src/stories/Story');
}, module);
