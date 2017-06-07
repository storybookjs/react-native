import addons from '@storybook/addons';
import { EVENT_ID } from './';

export function linkTo(kind, story) {
  return (...args) => {
    const resolvedKind = typeof kind === 'function' ? kind(...args) : kind;
    const resolvedStory = typeof story === 'function' ? story(...args) : story;

    const channel = addons.getChannel();
    channel.emit(EVENT_ID, { kind: resolvedKind, story: resolvedStory });
  };
}
