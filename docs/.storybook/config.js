import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { MemoryRouter } from 'react-router';

import 'bootstrap/dist/css/bootstrap.css';
import '../src/css/main.css';

addDecorator(fn => <MemoryRouter>{fn()}</MemoryRouter>);

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
