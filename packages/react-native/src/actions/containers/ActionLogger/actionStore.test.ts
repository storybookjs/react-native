import { Channel } from 'storybook/internal/channels';
import { SET_CURRENT_STORY } from 'storybook/internal/core-events';
import type { ActionDisplay } from 'storybook/actions';

const EVENT_ID = 'storybook/actions/action-event';

let mockChannel: Channel;

jest.mock('storybook/manager-api', () => ({
  addons: { getChannel: () => mockChannel },
}));

// The real entry point pulls in `storybook/test`, which registers its own test hooks.
jest.mock('storybook/actions', () => ({ EVENT_ID: 'storybook/actions/action-event' }));

type ActionStore = (typeof import('./actionStore'))['actionStore'];

const createAction = (
  id: string,
  args: unknown[] = [id],
  options: Partial<ActionDisplay['options']> = {}
): ActionDisplay => ({
  id,
  count: 0,
  data: { name: 'onPress', args },
  options: { limit: 50, clearOnStoryChange: true, ...options },
});

describe('actionStore', () => {
  let actionStore: ActionStore;

  beforeEach(() => {
    jest.resetModules();
    mockChannel = new Channel({});
    actionStore = require('./actionStore').actionStore;
    actionStore.listen();
  });

  it('records actions emitted on the channel, newest first', () => {
    mockChannel.emit(EVENT_ID, createAction('a'));
    mockChannel.emit(EVENT_ID, createAction('b'));

    expect(actionStore.getSnapshot().map((action) => action.id)).toEqual(['b', 'a']);
    expect(actionStore.getSnapshot()[0].count).toBe(1);
  });

  it('skips an action whose id is already logged', () => {
    const action = createAction('a');
    mockChannel.emit(EVENT_ID, action);
    const snapshot = actionStore.getSnapshot();

    mockChannel.emit(EVENT_ID, action);

    expect(actionStore.getSnapshot()).toBe(snapshot);
    expect(actionStore.getSnapshot()).toHaveLength(1);
  });

  it('bumps the count of the latest entry for identical data without mutating it', () => {
    mockChannel.emit(EVENT_ID, createAction('a', ['same']));
    const [first] = actionStore.getSnapshot();

    mockChannel.emit(EVENT_ID, createAction('b', ['same']));

    const snapshot = actionStore.getSnapshot();
    expect(snapshot).toHaveLength(1);
    expect(snapshot[0]).toMatchObject({ id: 'a', count: 2 });
    expect(snapshot[0]).not.toBe(first);
    expect(first.count).toBe(1);
  });

  it('logs a new entry when the data differs from the latest entry', () => {
    mockChannel.emit(EVENT_ID, createAction('a', ['same']));
    mockChannel.emit(EVENT_ID, createAction('b', ['other']));
    mockChannel.emit(EVENT_ID, createAction('c', ['same']));

    expect(actionStore.getSnapshot().map((action) => [action.id, action.count])).toEqual([
      ['c', 1],
      ['b', 1],
      ['a', 1],
    ]);
  });

  it('trims the log to the action limit', () => {
    for (const id of ['a', 'b', 'c', 'd']) {
      mockChannel.emit(EVENT_ID, createAction(id, [id], { limit: 3 }));
    }

    expect(actionStore.getSnapshot().map((action) => action.id)).toEqual(['d', 'c', 'b']);
  });

  it('clears the log on story change when the latest action has clearOnStoryChange', () => {
    mockChannel.emit(EVENT_ID, createAction('a'));

    mockChannel.emit(SET_CURRENT_STORY, { storyId: 'other--story' });

    expect(actionStore.getSnapshot()).toEqual([]);
  });

  it('keeps the log on story change when clearOnStoryChange is false', () => {
    mockChannel.emit(EVENT_ID, createAction('a', ['a'], { clearOnStoryChange: false }));

    mockChannel.emit(SET_CURRENT_STORY, { storyId: 'other--story' });

    expect(actionStore.getSnapshot()).toHaveLength(1);
  });

  it('clears the log and notifies subscribers', () => {
    const subscriber = jest.fn();
    const unsubscribe = actionStore.subscribe(subscriber);
    mockChannel.emit(EVENT_ID, createAction('a'));
    expect(subscriber).toHaveBeenCalledTimes(1);

    actionStore.clear();

    expect(actionStore.getSnapshot()).toEqual([]);
    expect(subscriber).toHaveBeenCalledTimes(2);

    unsubscribe();
    mockChannel.emit(EVENT_ID, createAction('b'));
    expect(subscriber).toHaveBeenCalledTimes(2);
  });

  it('does not add listeners twice when listen is called again on the same channel', () => {
    actionStore.listen();
    actionStore.listen();

    expect(mockChannel.listeners(EVENT_ID)).toHaveLength(1);
    expect(mockChannel.listeners(SET_CURRENT_STORY)).toHaveLength(1);
  });

  it('moves the listeners when the channel is replaced', () => {
    const oldChannel = mockChannel;
    oldChannel.emit(EVENT_ID, createAction('a'));

    mockChannel = new Channel({});
    actionStore.listen();

    expect(oldChannel.listeners(EVENT_ID) ?? []).toHaveLength(0);
    expect(oldChannel.listeners(SET_CURRENT_STORY) ?? []).toHaveLength(0);
    expect(mockChannel.listeners(EVENT_ID)).toHaveLength(1);
    expect(mockChannel.listeners(SET_CURRENT_STORY)).toHaveLength(1);

    oldChannel.emit(EVENT_ID, createAction('stale'));
    mockChannel.emit(EVENT_ID, createAction('b'));
    actionStore.listen();
    mockChannel.emit(EVENT_ID, createAction('c'));

    expect(actionStore.getSnapshot().map((action) => [action.id, action.count])).toEqual([
      ['c', 1],
      ['b', 1],
      ['a', 1],
    ]);
  });
});
