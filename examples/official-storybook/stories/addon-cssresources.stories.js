import React from 'react';
import { storiesOf } from '@storybook/react';
import { withCssResources } from '@storybook/addon-cssresources';

storiesOf('Addons|Cssresources', module)
  .addDecorator(
    withCssResources({
      cssresources: [
        {
          name: `bootstrap v4.1.3`,
          code: `<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"></link>`,
          picked: true,
        },
        {
          name: `bootstrap v3.3.5`,
          code: `<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css"></link>`,
          picked: false,
        },
      ],
    })
  )
  .add('Primary Large Button', () => (
    <button type="button" className="btn btn-lg btn-primary">
      Primary Large Button
    </button>
  ));

storiesOf('Addons|Cssresources', module)
  .addDecorator(
    withCssResources({
      cssresources: [
        {
          name: `fontawesome`,
          code: `<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></link>`,
          picked: true,
        },
        {
          name: `whitetheme`,
          code: `<style>.fa { color: #fff }</style>`,
          picked: true,
        },
      ],
    })
  )
  .add('Camera Icon', () => <i className="fa fa-camera-retro"> Camera Icon</i>);
