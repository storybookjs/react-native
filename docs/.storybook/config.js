import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { MemoryRouter } from 'react-router';

import 'bootstrap/dist/css/bootstrap.css';
import '../src/css/main.css';

addDecorator(storyFn => <MemoryRouter>{storyFn()}</MemoryRouter>);

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
