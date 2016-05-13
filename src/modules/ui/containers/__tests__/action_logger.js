const { describe, it } = global;
import { expect } from 'chai';
import { composer } from '../action_logger';

describe('manager.ui.containers.action_logger', () => {
  describe('composer', () => {
    it('should give correct data', () => {
      const clearActions = () => null;
      const actions = [{}];
      const mantraActions = () => ({
        api: {
          clearActions,
        },
      });

      const state = {
        api: {
          actions,
        },
      };

      const props = {
        actions: mantraActions,
      };

      const data = composer(state, props);
      expect(data.onClear).to.be.equal(clearActions);
      expect(data.actions).to.deep.equal(actions);
    });
  });
});
