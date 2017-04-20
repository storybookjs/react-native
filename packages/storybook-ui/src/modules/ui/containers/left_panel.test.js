import { mapper } from './left_panel';

describe('manager.ui.containers.left_panel', () => {
  describe('mapper', () => {
    test('should give correct data', () => {
      const stories = [{ kind: 'sk', stories: ['dd'] }];
      const selectedKind = 'sk';
      const selectedStory = 'dd';
      const uiOptions = {
        name: 'foo',
        url: 'bar',
      };
      const selectStory = () => 'selectStory';
      const toggleShortcutsHelp = () => 'toggleShortcutsHelp';
      const setStoryFilter = () => 'setStoryFilter';
      const props = {};
      const env = {
        actions: () => ({
          api: {
            selectStory,
          },
          ui: {
            toggleShortcutsHelp,
            setStoryFilter,
          },
        }),
      };
      const state = {
        storyFilter: null,
        stories,
        selectedKind,
        selectedStory,
        uiOptions,
      };
      const result = mapper(state, props, env);

      expect(result.stories).toEqual(stories);
      expect(result.selectedKind).toBe(selectedKind);
      expect(result.selectedStory).toBe(selectedStory);
      expect(result.storyFilter).toBe(null);
      expect(result.onSelectStory).toBe(selectStory);
      expect(result.onStoryFilter).toBe(setStoryFilter);
      expect(result.openShortcutsHelp).toBe(toggleShortcutsHelp);
    });

    test('should filter stories according to the given filter', () => {
      const stories = [
        { kind: 'pk', stories: ['dd'] },
        { kind: 'ss', stories: ['dd'] },
        { kind: 'pkr', stories: ['dd'] },
      ];
      const selectedKind = 'pk';
      const selectedStory = 'dd';
      const uiOptions = {
        name: 'foo',
        url: 'bar',
      };
      const selectStory = () => 'selectStory';
      const toggleShortcutsHelp = () => 'toggleShortcutsHelp';
      const setStoryFilter = () => 'setStoryFilter';
      const props = {};
      const env = {
        actions: () => ({
          api: {
            selectStory,
          },
          ui: {
            toggleShortcutsHelp,
            setStoryFilter,
          },
        }),
      };
      const state = {
        storyFilter: 'ss',
        stories,
        selectedKind,
        selectedStory,
        uiOptions,
      };
      const result = mapper(state, props, env);

      expect(result.stories).toEqual([
        stories[0], // selected kind is always there. That's why this is here.
        stories[1],
      ]);
    });

    test('should filter and sort stories according to the given filter', () => {
      const stories = [
        { kind: 'ss', stories: ['dd'] },
        { kind: 'pk', stories: ['dd'] },
        { kind: 'pkr', stories: ['dd'] },
      ];
      const selectedKind = 'pk';
      const selectedStory = 'dd';
      const uiOptions = {
        name: 'foo',
        url: 'bar',
        sortStoriesByKind: true,
      };
      const selectStory = () => 'selectStory';
      const toggleShortcutsHelp = () => 'toggleShortcutsHelp';
      const setStoryFilter = () => 'setStoryFilter';
      const props = {};
      const env = {
        actions: () => ({
          api: {
            selectStory,
          },
          ui: {
            toggleShortcutsHelp,
            setStoryFilter,
          },
        }),
      };
      const state = {
        storyFilter: 'ss',
        stories,
        selectedKind,
        selectedStory,
        uiOptions,
      };
      const result = mapper(state, props, env);

      expect(result.stories).toEqual([
        stories[1], // selected kind is always there. That's why this is here.
        stories[0],
      ]);
    });
  });
});
