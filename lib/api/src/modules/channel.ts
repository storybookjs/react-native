import deprecate from 'util-deprecate';
import { STORY_CHANGED } from '@storybook/core-events';
import { Module } from '../index';

type CallBack = (...args: any[]) => any;

export default ({ provider }: Module) => {
  const api = {
    getChannel: () => provider.channel,
    on: (type: string, cb: CallBack, peer = true) => {
      if (peer) {
        provider.channel.addPeerListener(type, cb);
      } else {
        provider.channel.addListener(type, cb);
      }

      return () => provider.channel.removeListener(type, cb);
    },
    off: (type: string, cb: CallBack) => {
      provider.channel.removeListener(type, cb);
    },
    emit: (type: string, event: any) => {
      provider.channel.emit(type, event);
    },
    onStory: deprecate((cb: CallBack) => api.on(STORY_CHANGED, cb), 'onStory(...) has been replaced with on(STORY_CHANGED, ...)'),
  };
  return { api };
};
