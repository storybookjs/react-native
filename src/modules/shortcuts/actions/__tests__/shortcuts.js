import actions from '../shortcuts';
import { expect } from 'chai';
const { describe, it } = global;

class MockClientStore {
  update(cb) {
    this.updateCallback = cb;
  }
}

describe('manager.shortcuts.actions.shortcuts', () => {
  describe('setOptions', () => {
    it('should update options', () => {
      const clientStore = new MockClientStore();
      actions.setOptions({ clientStore }, { abc: 10 });

      const state = {
        shortcutOptions: { bbc: 50, abc: 40 },
      };

      const stateUpdates = clientStore.updateCallback(state);
      expect(stateUpdates).to.deep.equal({
        shortcutOptions: { bbc: 50, abc: 10 },
      });
    });

    it('should only update options for the key already defined', () => {
      const clientStore = new MockClientStore();
      actions.setOptions({ clientStore }, { abc: 10, kki: 50 });

      const state = {
        shortcutOptions: { bbc: 50, abc: 40 },
      };

      const stateUpdates = clientStore.updateCallback(state);
      expect(stateUpdates).to.deep.equal({
        shortcutOptions: { bbc: 50, abc: 10 },
      });
    });
  });
});
