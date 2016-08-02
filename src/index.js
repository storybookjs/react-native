import React from 'react';
import addons from '@kadira/storybook-addons';
import ActionLogger from './containers/ActionLogger'

function _format(arg) {
  if (arg && typeof arg.preventDefault !== 'undefined') {
    return '[SyntheticEvent]';
  }
  return arg;
}

export function action(name) {
  return function (..._args) {
    const args = Array.from(_args).map(_format);
    const channel = addons.getChannel();
    channel.emit('addon:actions', {
      id: Math.random().toString(16).slice(2),
      data: { name, args },
    });
  };
}

export function register() {
  addons.register('kadirahq/storybook-addon-actions', api => {
    const channel = addons.getChannel();
    addons.addPanel('kadirahq/storybook-addon-actions', {
      title: 'Action Logger',
      render: () => <ActionLogger channel={channel} />
    });
  });
}
