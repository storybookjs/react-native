import { mapper } from './routed_link';

describe('manager.ui.containers.routed_link', () => {
  describe('mapper', () => {
    test('should give correct data', () => {
      const state = {
        shortcutOptions: {},
      };
      const props = {
        overrideParams: {
          selectedKind: 'kind',
          selectedStory: 'story',
        },
      };
      const { href } = mapper(state, props);

      expect(href).toContain('selectedKind=kind');
      expect(href).toContain('selectedStory=story');
    });
  });
});
