const { describe, it } = global;
import { expect } from 'chai';
import { composer } from '../layout';

describe('manager.ui.containers.layout', () => {
  describe('composer', () => {
    it('should give correct data', () => {
      const state = {
        shortcuts: {
          showLeftPanel: 'aa',
          showDownPanel: 'bb',
          goFullScreen: 'cc',
        },
      };

      const data = composer(state);
      expect(data).to.deep.equal(state.shortcuts);
    });
  });
});
