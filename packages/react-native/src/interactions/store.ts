import type { Channel } from 'storybook/internal/channels';
import { SET_CURRENT_STORY, STORY_RENDER_PHASE_CHANGED } from 'storybook/internal/core-events';
import { type Call, EVENTS, type LogItem, type SyncPayload } from 'storybook/internal/instrumenter';

export type InteractionsState = {
  storyId?: string;
  renderPhase?: string;
  calls: Record<string, Call>;
  logItems: LogItem[];
};

const initialState: InteractionsState = { calls: {}, logItems: [] };

// Collects the instrumenter's events from the moment the addon registers, so
// the panel has the full log even if it's first opened after the play function
// ran.
export function createInteractionsStore(channel: Channel) {
  let state = initialState;
  const listeners = new Set<() => void>();

  const update = (patch: Partial<InteractionsState>) => {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  };

  // Selecting the story that's already shown doesn't run it again, so keep its log.
  channel.on(SET_CURRENT_STORY, ({ storyId }: { storyId: string }) => {
    if (storyId !== state.storyId) update({ ...initialState, storyId, renderPhase: undefined });
  });
  channel.on(
    STORY_RENDER_PHASE_CHANGED,
    ({ storyId, newPhase }: { storyId: string; newPhase: string }) => {
      // Storybook drops a render after "preparing" when the story is already rendered, so only
      // later phases say a run is happening.
      if (newPhase === 'preparing') return;
      // A new run starts with "loading": clear the previous run's calls.
      const calls = newPhase === 'loading' ? {} : state.calls;
      update({ storyId, renderPhase: newPhase, calls });
    }
  );
  channel.on(EVENTS.CALL, (call: Call) => {
    update({ calls: { ...state.calls, [call.id]: call } });
  });
  channel.on(EVENTS.SYNC, ({ logItems }: SyncPayload) => {
    update({ logItems });
  });

  return {
    getState: () => state,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export type InteractionsStore = ReturnType<typeof createInteractionsStore>;
