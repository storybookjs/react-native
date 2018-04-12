//import React from 'react';

import { storiesOf } from '@storybook/marko';
// import { setOptions } from '@storybook/addon-options';
// import { action } from '@storybook/addon-actions';
// // eslint-disable-next-line import/named
// import { withNotes, WithNotes } from '@storybook/addon-notes';
// import centered from '@storybook/addon-centered';
// import { withInfo } from '@storybook/addon-info';
// import { Button } from '@storybook/marko/demo';

// import App from '../App';
// import Container from './Container';
// import LifecycleLogger from '../components/LifecycleLogger';

storiesOf('Button', module).add('with text', function() {
  //var myComponent = require('../components/hello/index.marko');
  //return myComponent.renderSync({ name:'Marko' });

  var myComponent = require('../components/click-count/index.marko');
  return myComponent.renderSync({});

  //.appendTo(document.getElementById('my-client-button')) // change so that we can continue to use the sticky header without the transform issue (SRP non-breaking)
  //.getComponent();
  //return `<div>hey this works</div>`
});
