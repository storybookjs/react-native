import { configure } from '@kadira/storybook';

configure(function () {
  require('../styles.css');
  require('../src/stories/Story');
}, module);
