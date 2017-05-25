import { configure } from '@storybook/react';

import 'bootstrap/dist/css/bootstrap.css';
import '../css/main.css';

function loadStories() {
  require('../stories')
}

configure(loadStories, module);
