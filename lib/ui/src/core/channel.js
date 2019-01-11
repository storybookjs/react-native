import deprecate from 'util-deprecate';
import { STORY_CHANGED } from '@storybook/core-events';

export default ({ provider }) => {
  const api = {
    getChannel: () => provider.channel,
    on: (type, cb, peer = true) => {
      if (peer) {
        provider.channel.addPeerListener(type, cb);
      } else {
        provider.channel.addListener(type, cb);
      }

      return () => provider.channel.removeListener(type, cb);
    },
    off: (type, cb) => {
      provider.channel.removeListener(type, cb);
    },
    emit: (type, event) => {
      provider.channel.emit(type, event);
    },
    onStory: deprecate(
      cb => api.on(STORY_CHANGED, cb),
      'onStory(...) has been replaced with on(STORY_CHANGED, ...)'
    ),
  };
  return { api };
};
