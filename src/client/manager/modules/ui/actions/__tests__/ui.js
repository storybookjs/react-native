import actions from '../ui';
import { expect } from 'chai';
import sinon from 'sinon';
import { types } from '../';
const { describe, it } = global;

describe('manager.ui.actions.ui', () => {
  describe('setStoryFilter', () => {
    it('should dispatch related redux action', () => {
      const reduxStore = {
        dispatch: sinon.stub(),
      };
      const filter = 'kkkind';

      actions.setStoryFilter({ reduxStore }, filter);
      const action = reduxStore.dispatch.args[0][0];
      expect(action).to.deep.equal({
        type: types.SET_STORY_FILTER,
        filter,
      });
    });
  });

  describe('toggleShortcutsHelp', () => {
    it('should dispatch related redux action', () => {
      const reduxStore = {
        dispatch: sinon.stub(),
      };

      actions.toggleShortcutsHelp({ reduxStore });
      const action = reduxStore.dispatch.args[0][0];
      expect(action).to.deep.equal({
        type: types.TOGGLE_SHORTCUTS_HELP,
      });
    });
  });
});
