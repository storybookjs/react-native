import { STORY_ARGS_UPDATED, UPDATE_STORY_ARGS } from 'storybook/internal/core-events';
import { start, updateView } from './Start';

jest.mock('storybook/manager-api', () => ({
  addons: {
    loadAddons: jest.fn(),
    setChannel: jest.fn(),
  },
}));

const basicId = 'example-button--basic';
const secondId = 'example-button--second';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Each call returns fresh module objects, like a Fast Refresh re-evaluation.
const createStoryEntries = (label: string, meta: Record<string, unknown> = {}) => {
  const storyFile = {
    default: {
      title: 'Example/Button',
      component: () => null,
      args: { label, size: 'medium' },
      ...meta,
    },
    Basic: {},
    Second: {},
  };

  return [
    {
      titlePrefix: '',
      directory: './stories',
      files: '**/*.stories.tsx',
      importPathMatcher: /^\.\/.*\.stories\.tsx$/,
      req: Object.assign(() => storyFile, { keys: () => ['./Button.stories.tsx'] }),
    },
  ];
};

const createAnnotations = () => [{ default: { parameters: {} } }];

const setup = async (meta?: Record<string, unknown>) => {
  delete (globalThis as { view?: unknown }).view;

  const view = start({
    annotations: createAnnotations(),
    storyEntries: createStoryEntries('a', meta),
  });
  const setStory = jest.fn();
  view._setStory = setStory;

  const preview = view._preview;
  await preview.ready();
  await preview.onSetCurrentStory({ storyId: basicId });
  await wait(50);

  const lastRendered = () => {
    const context = setStory.mock.calls.at(-1)?.[0];
    return { id: context?.id, label: context?.args.label };
  };

  return { view, preview, lastRendered };
};

const updateArgs = (view: ReturnType<typeof start>, storyId: string) =>
  new Promise<Record<string, unknown>>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('STORY_ARGS_UPDATED was not emitted')), 500);
    view._channel.once(STORY_ARGS_UPDATED, ({ args }) => {
      clearTimeout(timeout);
      resolve(args);
    });
    view._channel.emit(UPDATE_STORY_ARGS, { storyId, updatedArgs: { size: 'large' } });
  });

describe('updateView', () => {
  it('keeps args updates working after back-to-back updates', async () => {
    const { view, preview, lastRendered } = await setup();

    updateView(view, createAnnotations(), createStoryEntries('b'));
    updateView(view, createAnnotations(), createStoryEntries('c'));
    await wait(200);

    expect(lastRendered()).toEqual({ id: basicId, label: 'c' });
    expect(preview.storyRenders).toHaveLength(1);
    await expect(updateArgs(view, basicId)).resolves.toMatchObject({ size: 'large' });
  });

  it('keeps args updates working when a story is selected during an update', async () => {
    const { view, preview, lastRendered } = await setup();

    updateView(view, createAnnotations(), createStoryEntries('b'));
    preview.onSetCurrentStory({ storyId: secondId });
    updateView(view, createAnnotations(), createStoryEntries('c'));
    await wait(200);

    expect(lastRendered()).toEqual({ id: secondId, label: 'c' });
    expect(preview.storyRenders).toHaveLength(1);
    await expect(updateArgs(view, secondId)).resolves.toMatchObject({ size: 'large' });
  });

  it('applies updates that arrive while the story loaders are running', async () => {
    const loaders = [() => wait(200).then(() => ({}))];
    const { view, preview, lastRendered } = await setup({ loaders });
    await wait(250);

    updateView(view, createAnnotations(), createStoryEntries('b', { loaders }));
    await wait(50);
    updateView(view, createAnnotations(), createStoryEntries('c', { loaders }));
    await wait(600);

    expect(lastRendered()).toEqual({ id: basicId, label: 'c' });

    updateView(view, createAnnotations(), createStoryEntries('d', { loaders }));
    await wait(400);

    expect(lastRendered()).toEqual({ id: basicId, label: 'd' });
    expect(preview.storyRenders).toHaveLength(1);
  });
});
