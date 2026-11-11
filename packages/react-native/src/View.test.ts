import type { SelectionStore } from 'storybook/internal/preview-api';
import { View } from './View';

jest.mock('storybook/manager-api', () => ({
  addons: {
    loadAddons: jest.fn(),
    setChannel: jest.fn(),
  },
}));

describe('View story selection persistence', () => {
  const createView = () => {
    const selectionStore = {
      selectionSpecifier: null,
      setQueryParams: jest.fn(),
    } as unknown as SelectionStore;

    selectionStore.setSelection = jest.fn((selection) => {
      selectionStore.selection = selection;
    });

    const preview = {
      selectionStore,
      selectSpecifiedStory: jest.fn(async () => {
        if (selectionStore.selection) return;

        const storySpecifier = selectionStore.selectionSpecifier?.storySpecifier;
        const storyId = storySpecifier === '*' ? 'first--story' : String(storySpecifier);

        selectionStore.setSelection({ storyId, viewMode: 'story' });
      }),
    };

    const view = new View(preview as any, {} as any, {});
    view._storyIndex = {
      entries: {
        'first--story': { id: 'first--story', type: 'story', tags: ['dev', 'test'] },
        'second--story': { id: 'second--story', type: 'story', tags: ['dev', 'test'] },
      },
    } as any;

    return { preview, selectionStore, view };
  };

  it('applies the initial story even when the preview already has a selection', async () => {
    const { preview, selectionStore, view } = createView();

    selectionStore.selection = { storyId: 'first--story', viewMode: 'story' };

    await view._selectInitialStory({
      selectionSpecifier: { storySpecifier: 'second--story', viewMode: 'story' },
    });

    expect(preview.selectSpecifiedStory).toHaveBeenCalledTimes(1);
    expect(selectionStore.selection).toEqual({ storyId: 'second--story', viewMode: 'story' });
  });

  it('prefers an initial URL story over the persisted selection', async () => {
    const { selectionStore, view } = createView();

    await view._selectInitialStory({
      selectionSpecifier: { storySpecifier: 'second--story', viewMode: 'story' },
      storyIdFromUrl: 'first--story',
    });

    expect(selectionStore.selection).toEqual({ storyId: 'first--story', viewMode: 'story' });
  });

  it('selects the first story shown in the sidebar when there is no saved selection', async () => {
    const { view } = createView();

    expect(await view._getInitialStory({ shouldPersistSelection: false })).toEqual({
      storySpecifier: 'first--story',
      viewMode: 'story',
    });

    // a story tagged `!dev` is hidden from the sidebar, so it isn't opened by default
    view._storyIndex.entries['first--story'].tags = ['test'];

    expect(await view._getInitialStory({ shouldPersistSelection: false })).toEqual({
      storySpecifier: 'second--story',
      viewMode: 'story',
    });
  });
});
