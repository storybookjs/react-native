import { shortcutMapper } from './layout';

describe('manager.ui.containers.layout', () => {
  describe('shortcutMapper', () => {
    test('should give correct data', () => {
      const state = {
        shortcutOptions: {
          showStoriesPanel: 'aa',
          showAddonPanel: 'bb',
          goFullScreen: 'cc',
        },
      };
      const data = shortcutMapper(state);

      expect(data).toEqual(state.shortcutOptions);
    });
  });
});
