import { start } from '../Start';

jest.mock('storybook/manager-api', () => ({
  addons: {
    loadAddons: jest.fn(),
    setChannel: jest.fn(),
    register: jest.fn(),
  },
  types: { PANEL: 'panel' },
}));

const storyEntries = [
  {
    titlePrefix: '',
    directory: './stories',
    files: '**/*.stories.tsx',
    importPathMatcher: /^\.\/.*\.stories\.tsx$/,
    req: Object.assign(
      () => ({ default: { title: 'Example', component: () => null }, Basic: {} }),
      { keys: () => ['./Example.stories.tsx'] }
    ),
  },
];

const legacyPreview = {
  default: {
    parameters: {
      backgrounds: { default: 'plain', values: [{ name: 'plain', value: '#fff' }] },
    },
  },
};

// The panel selects a background by emitting UPDATE_GLOBALS, which lands in this store.
const startWithGlobals = async (annotations: any[]) => {
  delete (globalThis as { view?: unknown }).view;
  const view = start({ annotations, storyEntries });
  await view._preview.ready();
  return view._preview.storyStoreValue!.userGlobals;
};

// Storybook's core annotations declare the `backgrounds` global, so selecting a background works in
// projects that only use the legacy `values`/`default` parameters and have no `initialGlobals`.
describe('backgrounds global', () => {
  it('accepts a background selection in projects that only use the legacy parameters', async () => {
    const globals = await startWithGlobals([legacyPreview]);
    expect(globals.get().backgrounds?.value).toBeUndefined();

    globals.update({ backgrounds: { value: 'plain' } });
    expect(globals.get().backgrounds).toEqual({ value: 'plain' });
  });

  it('keeps the initial background from initialGlobals', async () => {
    const globals = await startWithGlobals([
      { default: { initialGlobals: { backgrounds: { value: 'dark' } } } },
    ]);
    expect(globals.get().backgrounds?.value).toBe('dark');
  });
});
