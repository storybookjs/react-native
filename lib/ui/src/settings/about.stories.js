import React from 'react';
import { storiesOf } from '@storybook/react';
import { ServerLocation } from '@reach/router';
import About from './about';

storiesOf('UI|About', module)
  .addDecorator(fn => (
    <ServerLocation url="http://localhost:9011/?path=/settings">{fn()}</ServerLocation>
  ))
  .add('default', () => <About />);
