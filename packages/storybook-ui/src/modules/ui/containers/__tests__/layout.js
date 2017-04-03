import { expect } from 'chai';
import { mapper } from '../layout';

describe('manager.ui.containers.layout', () => {
  describe('mapper', () => {
    it('should give correct data', () => {
      const state = {
        shortcutOptions: {
          showLeftPanel: 'aa',
          showDownPanel: 'bb',
          goFullScreen: 'cc'
        }
      };

      const data = mapper(state);
      expect(data).to.deep.equal(state.shortcutOptions);
    });
  });
});
