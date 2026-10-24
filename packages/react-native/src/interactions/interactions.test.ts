import { Channel } from 'storybook/internal/channels';
import {
  FORCE_REMOUNT,
  SET_CURRENT_STORY,
  STORY_RENDER_PHASE_CHANGED,
} from 'storybook/internal/core-events';
import { EVENTS, type Call } from 'storybook/internal/instrumenter';
import { setStoryRoot } from '../components/StoryView/storyRoot';
import { start } from '../Start';
import { formatCall } from './format';
import { createInteractionsStore } from './store';

jest.mock('storybook/manager-api', () => ({
  addons: {
    add: jest.fn(),
    getChannel: jest.fn(),
    loadAddons: jest.fn(),
    register: jest.fn(),
    setChannel: jest.fn(),
  },
  types: { PANEL: 'panel' },
}));

const storyId = 'example-form--filled';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type PlayContext = { canvasElement: unknown; canvas?: unknown; userEvent?: unknown };

const setup = async (play: (context: PlayContext) => Promise<void>) => {
  delete (globalThis as { view?: unknown }).view;

  const storyFile = {
    default: { title: 'Example/Form', component: () => null },
    Filled: { play },
  };
  const view = start({
    annotations: [{ default: { parameters: {} } }],
    storyEntries: [
      {
        titlePrefix: '',
        directory: './stories',
        files: '**/*.stories.tsx',
        importPathMatcher: /^\.\/.*\.stories\.tsx$/,
        req: Object.assign(() => storyFile, { keys: () => ['./Form.stories.tsx'] }),
      },
    ],
  });

  // Stands in for `StoryView`, which attaches its wrapper as the story root.
  const roots: object[] = [];
  view._setStory = (context: { id: string }) => {
    const root = { id: `root-${roots.length}` };
    roots.push(root);
    setStoryRoot(context.id, root);
  };

  const phases: string[] = [];
  view._channel.on(STORY_RENDER_PHASE_CHANGED, ({ newPhase }: { newPhase: string }) =>
    phases.push(newPhase)
  );

  await view._preview.ready();
  await view._preview.onSetCurrentStory({ storyId });

  return { view, roots, phases };
};

describe('ondeviceInteractions', () => {
  beforeEach(() => {
    globalThis.FEATURES = { ...globalThis.FEATURES, ondeviceInteractions: true };
  });

  afterEach(() => {
    globalThis.FEATURES = { ...globalThis.FEATURES, ondeviceInteractions: false };
  });

  it('runs play functions with the story root as canvasElement, and canvas and userEvent', async () => {
    const contexts: PlayContext[] = [];
    const { roots, phases } = await setup(async (context) => {
      contexts.push(context);
    });
    await wait(100);

    expect(contexts.map((context) => context.canvasElement)).toEqual([roots[0]]);
    expect(contexts[0].canvas).toMatchObject({ getByRole: expect.any(Function) });
    expect(contexts[0].userEvent).toMatchObject({ click: expect.any(Function) });
    expect(phases).toContain('finished');
  });

  // Storybook's own remount reloads the page while a play function runs.
  it('reruns the story when Rerun is pressed during its play function, without reloading', async () => {
    const reload = jest.fn();
    Object.defineProperty(window, 'location', { value: { reload }, configurable: true });

    try {
      let runs = 0;
      const { view, roots } = await setup(async () => {
        runs += 1;
        await wait(100);
      });
      await wait(30);

      view._channel.emit(FORCE_REMOUNT, { storyId });
      await wait(400);

      expect(runs).toBe(2);
      expect(roots).toHaveLength(2);
      expect(reload).not.toHaveBeenCalled();
    } finally {
      delete (window as { location?: unknown }).location;
    }
  });
});

describe('createInteractionsStore', () => {
  const storyId = 'example-form--filled';
  const call = { id: `${storyId} [0] expect`, method: 'expect' } as Call;
  const logItem = { callId: call.id, status: 'done', ancestors: [] };

  const runStory = (channel: Channel) => {
    channel.emit(SET_CURRENT_STORY, { storyId });
    for (const newPhase of ['preparing', 'loading', 'rendering', 'playing']) {
      channel.emit(STORY_RENDER_PHASE_CHANGED, { storyId, newPhase });
    }
    channel.emit(EVENTS.CALL, call);
    channel.emit(STORY_RENDER_PHASE_CHANGED, { storyId, newPhase: 'finished' });
    channel.emit(EVENTS.SYNC, { logItems: [logItem] });
  };

  it('keeps the log when the story that is already shown is selected again', () => {
    const channel = new Channel({});
    const store = createInteractionsStore(channel);
    runStory(channel);

    // Storybook prepares a render for the reselected story, then drops it.
    channel.emit(SET_CURRENT_STORY, { storyId });
    channel.emit(STORY_RENDER_PHASE_CHANGED, { storyId, newPhase: 'preparing' });
    channel.emit(EVENTS.SYNC, { logItems: [logItem] });

    expect(store.getState()).toMatchObject({
      renderPhase: 'finished',
      calls: { [call.id]: call },
      logItems: [logItem],
    });
  });

  it('clears the log when another story is selected', () => {
    const channel = new Channel({});
    const store = createInteractionsStore(channel);
    runStory(channel);

    channel.emit(SET_CURRENT_STORY, { storyId: 'example-form--empty' });

    expect(store.getState()).toEqual({
      storyId: 'example-form--empty',
      renderPhase: undefined,
      calls: {},
      logItems: [],
    });
  });
});

describe('formatCall', () => {
  const call = (overrides: Partial<Call>): Call => ({
    id: 'call',
    storyId,
    cursor: 0,
    ancestors: [],
    path: [],
    method: 'expect',
    args: [],
    interceptable: true,
    retain: false,
    ...overrides,
  });

  it('formats steps as their label', () => {
    expect(formatCall(call({ method: 'step', args: ['Fill in the form'] }), {})).toBe(
      'Fill in the form'
    );
  });

  it('formats assertion chains', () => {
    const calls = { expect: call({ id: 'expect', args: ['Ada'] }) };
    const toBe = call({
      method: 'toBe',
      path: [{ __callId__: 'expect' }, 'not'],
      args: ['Grace'],
    });

    expect(formatCall(toBe, calls)).toBe('expect("Ada").not.toBe("Grace")');
  });

  it('formats serialized values', () => {
    expect(
      formatCall(
        call({
          method: 'toHaveBeenCalledWith',
          args: [
            { __function__: { name: 'onSubmit' } },
            { __regexp__: { source: '^a', flags: 'i' } },
          ],
        }),
        {}
      )
    ).toBe('toHaveBeenCalledWith(onSubmit(), /^a/i)');
  });
});
