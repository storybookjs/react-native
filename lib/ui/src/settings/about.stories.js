import React from 'react';
import { storiesOf } from '@storybook/react';
import AboutScreen from './about';

storiesOf('UI|AboutPage', module)
  .add('up to date', () => (
    <AboutScreen latest={{ version: '5.0.0' }} current={{ version: '5.0.0' }} />
  ))
  .add('new version required', () => (
    <AboutScreen latest={{ version: '5.0.3' }} current={{ version: '5.0.0' }} />
  ));
