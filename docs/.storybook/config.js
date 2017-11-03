import { configure } from '@storybook/react';

import 'bootstrap/dist/css/bootstrap.css';
import '../src/css/main.css';

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
