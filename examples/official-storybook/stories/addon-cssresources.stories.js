import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Addons|Cssresources', module)
  .addParameters({
    cssresources: [
      {
        id: `bootstrap v4.1.3`,
        code: `<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"></link>`,
        picked: true,
      },
      {
        id: `bootstrap v3.3.5`,
        code: `<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css"></link>`,
        picked: false,
      },
    ],
    options: {
      selectedPanel: 'storybook/cssresources/panel',
    },
  })
  .add('Primary Large Button', () => (
    <button type="button" className="btn btn-lg btn-primary">
      Primary Large Button
    </button>
  ));

storiesOf('Addons|Cssresources', module)
  .addParameters({
    cssresources: [
      {
        id: `fontawesome`,
        code: `<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></link>`,
        picked: true,
      },
      {
        id: `whitetheme`,
        code: `<style>.fa { color: #fff }</style>`,
        picked: false,
      },
    ],
    options: {
      selectedPanel: 'storybook/cssresources/panel',
    },
  })

  .add('Camera Icon', () => <i className="fa fa-camera-retro"> Camera Icon</i>);
