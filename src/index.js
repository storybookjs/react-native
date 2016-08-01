import React from 'react';
import addons from '@kadira/storybook-addons';
import ActionLogger from './containers/ActionLogger'

function _format(message) {
  if (typeof message.preventDefault !== 'undefined') {
    return '[SyntheticEvent]';
  }
  return message;
}

export function action(name) {
  return function (_message) {
    const message = _format(_message);
    const channel = addons.getChannel();
    channel.emit('addon:actions', {
      id: Math.random().toString(16).slice(2),
      data: { name, message },
    });
  };
}

export function register() {
  addons.register('kadirahq/storybook-addon-actions', api => {
    addons.addPanel('kadirahq/storybook-addon-actions', {
      title: 'Action Logger',
      render() {
        const channel = addons.getChannel();
        return <ActionLogger channel={channel} />;
      }
    });
  });
}
