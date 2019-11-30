/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';

import Hero from './Hero';

const chapter = storiesOf('Webapp screens/Marketing/LandingScreen/Hero', module)
  .add('default', () => <Hero />)
  .add('maintenanceMode', () => <Hero maintenanceMode />);

// Remove this story from storyshots. Let's use the parameters API for this soon!
if (typeof jest === 'undefined') {
  chapter.add('video start open', () => <Hero startOpen />);
}
