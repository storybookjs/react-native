import React from 'react';
import { storiesOf } from '@storybook/react';
import { ServerLocation } from '@reach/router';
import AboutPage from './about';

// TODO: would be nice if this url was actually reflected in storybook UI

storiesOf('UI|AboutPage', module)
  .addDecorator(fn => (
    <ServerLocation url="http://localhost:9011/?path=/settings">{fn()}</ServerLocation>
  ))
  .add('default', () => <AboutPage latest={{ version: '5.0.0' }} current={{ version: '5.0.1' }} />);
