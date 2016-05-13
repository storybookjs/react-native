import reducer from '../ui';
import { expect } from 'chai';
import { types } from '../../../actions';
const { describe, it } = global;

describe('manager.ui.config.reducers.ui', () => {
  describe('SET_STORY_FILTER', () => {
    it('should set the given filter', () => {
      const filter = 'wow';
      const oldState = {
        storyFilter: 'xxxxx',
      };

      const action = {
        type: types.SET_STORY_FILTER,
        filter,
      };
      const newState = reducer(oldState, action);
      expect(newState.storyFilter).to.be.equal(filter);
    });
  });

  describe('TOGGLE_SHORTCUTS_HELP', () => {
    it('should toggle the showShortcutsHelp value', () => {
      const oldState = {
        showShortcutsHelp: false,
      };

      const action = {
        type: types.TOGGLE_SHORTCUTS_HELP,
      };
      const newState = reducer(oldState, action);
      expect(newState.showShortcutsHelp).to.be.equal(!oldState.showShortcutsHelp);
    });
  });
});
