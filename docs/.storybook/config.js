import { configure } from '@kadira/storybook';
import 'bootstrap/dist/css/bootstrap.css';
import '../src/index.css';

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
