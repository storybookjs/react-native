import deprecate from 'util-deprecate';
import { STORY_CHANGED } from '@storybook/core-events';
import { Module } from '../index';

type CallBack = (...args: any[]) => any;

export interface SubAPI {
  getChannel: () => any;
  on: (type: string, cb: CallBack, peer?: boolean) => () => void;
  off: (type: string, cb: CallBack) => void;
  emit: (type: string, event?: any) => void;
  onStory: (cb: CallBack) => void;
}

export default ({ provider }: Module) => {
  const api: SubAPI = {
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
