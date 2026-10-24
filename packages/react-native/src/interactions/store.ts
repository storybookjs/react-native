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

  channel.on(SET_CURRENT_STORY, ({ storyId }: { storyId: string }) => {
    update({ ...initialState, storyId });
  });
  channel.on(
    STORY_RENDER_PHASE_CHANGED,
    ({ storyId, newPhase }: { storyId: string; newPhase: string }) => {
      update({ storyId, renderPhase: newPhase });
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
