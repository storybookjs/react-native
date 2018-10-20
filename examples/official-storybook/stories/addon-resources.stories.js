import React from 'react';
import { storiesOf } from '@storybook/react';

const myButton = (label, className) => () => (
  <button type="button" className={className}>
    {label}
  </button>
);

const myIcon = (label, className) => () => (
  <div>
    <i className={className} /> {label}
  </div>
);

storiesOf('Addons|Resources', module)
  .add('Primary Large Button', myButton('Primary Large Button', 'btn btn-lg btn-primary'))
  .add('Secondary Button', myButton('Secondary Button', 'btn btn-secondary'));

storiesOf('Addons|Resources', module).add(
  'Camera Icon',
  myIcon('fa-camera-retro', 'fa fa-camera-retro')
);
