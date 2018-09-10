import React from 'react';
import { addDecorator, storiesOf } from '@storybook/react';
import { withResources } from '@storybook/addon-resources';

const bootstrapButton = (label, className) => () => (
  <button type="button" className={className}>
    {label}
  </button>
);
const fontawesomeIcon = (label, className) => () => (
  <div>
    <i className={className} /> {label}
  </div>
);

addDecorator(
  withResources({
    resources: [
      'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
    ],
  })
);

storiesOf('Addons|Resources', module)
  .add('Dark Large Button', bootstrapButton('Dark Large Button', 'btn btn-lg btn-dark'))
  .add('Inverse Large Button', bootstrapButton('Inverse Large Button', 'btn btn-lg btn-inverse'));

storiesOf('Addons|Resources', module).add(
  'Camera Icon',
  fontawesomeIcon('fa-camera-retro', 'fa fa-camera-retro')
);

// storiesOf('Addons|Resources', module)
//   .addDecorator(withResources)
//   .add('story 1', baseStory("hello world"), {
//     resources: []
//       // [ 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
//       //   'https://code.jquery.com/jquery-3.3.1.js' ]
//   }).add('story 2', baseStory("still hello world"), {
//     resources:
//       []
//   });

// storiesOf('Addons|Resources', module)
//   .addDecorator(withResources)
//   .add('story 1', baseStory("hello world"), {
//     resources: [ 'https://code.jquery.com/jquery-3.3.1.js' ]
//   }).add('story 2', baseStory("still hello world"));
