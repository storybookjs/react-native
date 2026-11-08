import type { Addon_StorySortParameterV7 } from 'storybook/internal/types';
import { start, updateView } from './Start';

jest.mock('storybook/manager-api', () => ({
  addons: {
    loadAddons: jest.fn(),
    setChannel: jest.fn(),
  },
}));

// One story file per title, in the order the bundler would list them.
const createStoryEntries = (titles: string[]) => {
  const files = Object.fromEntries(
    titles.map((title) => [
      `./${title.replace(/\//g, '-')}.stories.tsx`,
      { default: { title, component: () => null }, Basic: {} },
    ])
  );

  return [
    {
      titlePrefix: '',
      directory: './stories',
      files: '**/*.stories.tsx',
      importPathMatcher: /^\.\/.*\.stories\.tsx$/,
      req: Object.assign((key: string) => files[key], { keys: () => Object.keys(files) }),
    },
  ];
};

const annotations = [{ default: { parameters: {} } }];

const titles = (view: ReturnType<typeof start>) =>
  Object.values(view._storyIndex.entries).map((entry) => entry.title);

const storySorts: Addon_StorySortParameterV7[] = [
  { order: ['Introduction', 'Components'] },
  (a, b) => a.title.localeCompare(b.title),
];

describe('storySorts on device', () => {
  beforeEach(() => {
    delete (globalThis as { view?: unknown }).view;
  });

  it('keeps file order without storySorts', () => {
    const view = start({
      annotations,
      storyEntries: createStoryEntries(['Hooks', 'Components/Button', 'Introduction']),
    });

    expect(titles(view)).toEqual(['Hooks', 'Components/Button', 'Introduction']);
  });

  it('sorts the index with storySorts from start', () => {
    const view = start({
      annotations,
      storyEntries: createStoryEntries([
        'Hooks',
        'Components/Button',
        'Introduction',
        'Components/Avatar',
      ]),
      storySorts,
    });

    expect(titles(view)).toEqual([
      'Introduction',
      'Components/Avatar',
      'Components/Button',
      'Hooks',
    ]);
  });

  it('ignores storySort in preview parameters', () => {
    const view = start({
      annotations: [
        { default: { parameters: { options: { storySort: { method: 'alphabetical' } } } } },
      ],
      storyEntries: createStoryEntries(['Hooks', 'Components/Button', 'Introduction']),
    });

    expect(titles(view)).toEqual(['Hooks', 'Components/Button', 'Introduction']);
  });

  it('sorts stories added by updateView', async () => {
    const view = start({
      annotations,
      storyEntries: createStoryEntries(['Hooks', 'Introduction']),
      storySorts,
    });
    await view._preview.ready();

    updateView(
      view,
      annotations,
      createStoryEntries(['Hooks', 'Introduction', 'Components/Button', 'Accessibility']),
      undefined,
      storySorts
    );

    expect(titles(view)).toEqual(['Introduction', 'Components/Button', 'Accessibility', 'Hooks']);
  });
});
