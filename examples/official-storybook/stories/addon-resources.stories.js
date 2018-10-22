import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Addons|Resources', module)
  .add('Primary Large Button', () => (
    <button type="button" className="btn btn-lg btn-primary">
      Primary Large Button
    </button>
  ))
  .add('Secondary Button', () => (
    <button type="button" className="btn btn-secondary">
      Secondary Button
    </button>
  ));

storiesOf('Addons|Resources', module).add('Camera Icon', () => (
  <i className="fa fa-camera-retro">Camera Icon</i>
));
