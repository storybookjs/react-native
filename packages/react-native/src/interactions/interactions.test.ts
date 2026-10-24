import { FORCE_REMOUNT, STORY_RENDER_PHASE_CHANGED } from 'storybook/internal/core-events';
import type { Call } from 'storybook/internal/instrumenter';
import { setStoryRoot } from '../components/StoryView/storyRoot';
import { start } from '../Start';
import { formatCall } from './format';

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

const setup = async (play: (context: { canvasElement: unknown }) => Promise<void>) => {
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

  it('runs play functions with the story root as canvasElement', async () => {
    const canvasElements: unknown[] = [];
    const { roots, phases } = await setup(async ({ canvasElement }) => {
      canvasElements.push(canvasElement);
    });
    await wait(100);

    expect(canvasElements).toEqual([roots[0]]);
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
