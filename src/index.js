import React from 'react';
import addons from '@kadira/storybook-addons';

export function linkTo(kind, story) {
  return function () {
    const channel = addons.getChannel();
    channel.emit('addon:links', {kind, story});
  };
}

export function register() {
  addons.register('kadirahq/storybook-addon-links', api => {
    const channel = addons.getChannel();
    channel.on('addon:links', selection => {
      api.selectStory(selection.kind, selection.story);
    });
  });
}
