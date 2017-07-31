import { mapper } from './search_box';

describe('manager.ui.containers.search_box', () => {
  describe('mapper', () => {
    test('should give correct data', () => {
      const stories = [{ kind: 'sk', stories: ['dd'] }];
      const state = {
        shortcutOptions: {
          showSearchBox: true,
        },
        stories,
      };

      const selectStory = () => 'selectStory';
      const setOptions = jest.fn();
      const props = {};
      const env = {
        actions: () => ({
          api: {
            selectStory,
          },
          shortcuts: {
            setOptions,
          },
        }),
      };
      const data = mapper(state, props, env);

      const expectedData = {
        showSearchBox: true,
        stories,
        onSelectStory: selectStory,
      };

      expect(data).toMatchObject(expectedData);

      data.onClose();
      expect(setOptions).toHaveBeenCalledWith({
        showSearchBox: false,
      });
    });
  });
});
