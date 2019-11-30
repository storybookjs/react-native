/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { specs, urls } from './LiveView.stories';
import { ignoredRegions } from './IgnoredRegions.stories';
export { specs, urls, ignoredRegions };

const figure = 'http://via.placeholder.com/400x350';

const captureImageSize = { width: 300, height: 300 };
const CHROMATIC_DELAY = { chromatic: { delay: 500 } };

storiesOf('Webapp components/Canvas', module)
  .add(
    'interactiveUrl w/ interactiveMode',
    () => (
      <Canvas
        interactiveUrl={urls.storybook52}
        interactiveMode="interactive"
        figure={figure}
        captureImageSize={captureImageSize}
        spec={specs.basic}
        showIgnoredRegions={false}
      />
    ),
    CHROMATIC_DELAY
  )
  .add(
    'wide short image',
    () => (
      <Canvas
        figure="http://via.placeholder.com/900x350"
        captureImageSize={{ width: 900, height: 350 }}
        showIgnoredRegions={false}
      />
    ),
    { chromatic: { viewports: [600, 1200] } }
  );
