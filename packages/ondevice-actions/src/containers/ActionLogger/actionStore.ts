import deepEqual from 'fast-deep-equal';
import { addons } from 'storybook/manager-api';
import { SET_CURRENT_STORY } from 'storybook/internal/core-events';
import { ActionDisplay, EVENT_ID } from 'storybook/actions';

type Channel = ReturnType<typeof addons.getChannel>;

const safeDeepEqual = (a: unknown, b: unknown): boolean => {
  try {
    return deepEqual(a, b);
  } catch {
    return false;
  }
};

let actions: ActionDisplay[] = [];
let boundChannel: Channel | null = null;
const subscribers = new Set<() => void>();

const setActions = (next: ActionDisplay[]) => {
  actions = next;
  subscribers.forEach((subscriber) => subscriber());
};

const addAction = (action: ActionDisplay) => {
  if (actions.find((a) => a.id === action.id)) {
    return;
  }

  const [previous, ...rest] = actions;
  if (previous && safeDeepEqual(previous.data, action.data)) {
    setActions([{ ...previous, count: previous.count + 1 }, ...rest]);
  } else {
    setActions([{ ...action, count: 1 }, ...actions].slice(0, action.options.limit));
  }
};

const handleStoryChange = () => {
  if (actions.length > 0 && actions[0].options.clearOnStoryChange) {
    setActions([]);
  }
};

/**
 * Logged actions, kept outside the panel component so the log survives the panel unmounting
 * (e.g. a collapsed panel, or a custom UI that renders addons in a sheet that unmounts on close).
 */
export const actionStore = {
  /**
   * Starts recording actions from the current channel. Safe to call repeatedly: if
   * `getStorybookUI` has replaced the channel (e.g. after Fast Refresh), the listeners are moved
   * from the old channel to the new one.
   */
  listen() {
    const channel = addons.getChannel();
    if (channel === boundChannel) {
      return;
    }

    boundChannel?.removeListener(EVENT_ID, addAction);
    boundChannel?.removeListener(SET_CURRENT_STORY, handleStoryChange);
    channel.addListener(EVENT_ID, addAction);
    channel.addListener(SET_CURRENT_STORY, handleStoryChange);
    boundChannel = channel;
  },
  clear() {
    setActions([]);
  },
  getSnapshot() {
    return actions;
  },
  subscribe(subscriber: () => void) {
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    };
  },
};
