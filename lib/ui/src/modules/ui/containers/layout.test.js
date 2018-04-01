import { mapper } from './layout';

describe('manager.ui.containers.layout', () => {
  describe('mapper', () => {
    test('should give correct data', () => {
      const state = {
        shortcutOptions: {
          showStoriesPanel: 'aa',
          showAddonPanel: 'bb',
          goFullScreen: 'cc',
        },
      };
      const data = mapper(state);

      expect(data).toEqual(state.shortcutOptions);
    });
  });
});
