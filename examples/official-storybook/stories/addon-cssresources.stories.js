import React from 'react';

export default {
  title: 'Addons|Cssresources',
};

export const primaryLargeButton = () => (
  <button type="button" className="btn btn-lg btn-primary">
    Primary Large Button
  </button>
);
primaryLargeButton.story = {
  name: 'Primary Large Button',
  parameters: {
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
  },
};

export const cameraIcon = () => <i className="fa fa-camera-retro"> Camera Icon</i>;
cameraIcon.story = {
  name: 'Camera Icon',
  parameters: {
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
  },
};
