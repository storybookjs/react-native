import React from 'react';
import { hrefTo } from '@storybook/addon-links';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Addons|Links.Href',
};

export const log = () => {
  hrefTo('Addons|Links.Href', 'log').then(href => action('URL of this story')(href));

  return <span>See action logger</span>;
};
log.story = {
  parameters: {
    options: {
      panel: 'storybook/actions/panel',
    },
  },
};
