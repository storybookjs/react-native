//import React from 'react';

import { storiesOf } from '@storybook/marko';
// import { setOptions } from '@storybook/addon-options';
// import { action } from '@storybook/addon-actions';
// // eslint-disable-next-line import/named
// import { withNotes, WithNotes } from '@storybook/addon-notes';
// import centered from '@storybook/addon-centered';

import Hello from '../components/hello/index.marko';
import ClickCount from '../components/click-count/index.marko';
import StopWatch from '../components/stop-watch/index.marko';
import Welcome from '../components/welcome/index.old.marko';

storiesOf('Hello', module).
  add('with text abc', () => Hello.renderSync({name: 'abc'})).
  add('with text xyz', () => Hello.renderSync({name: 'xyz'})).
  add('with No Preview!').
  add('with ERROR!', () => 'NOT A MARKO RENDER_RESULT');

storiesOf('Watch', module).
  add('click counter', () => ClickCount.renderSync({})).
  add('stop watch', () => StopWatch.renderSync({}));

storiesOf('Welcome', module).
  add('welcome', () => Welcome.renderSync({}));
