import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import { ServerLocation } from '@reach/router';
import About from './about';

// TODO: would be nice if this url was actually reflected in storybook UI

storiesOf('UI|About', module)
  .addDecorator(fn => (
    <ServerLocation url="http://localhost:9011/?path=/settings">{fn()}</ServerLocation>
  ))
  .add('default', () => <About />);
