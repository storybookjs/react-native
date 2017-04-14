import actions from '../ui';
import { expect } from 'chai';
import sinon from 'sinon';
const { describe, it } = global;

describe('manager.ui.actions.ui', () => {
  describe('setStoryFilter', () => {
    it('should set the given filter', () => {
      const clientStore = {
        set: sinon.stub(),
      };
      const filter = 'kkkind';

      actions.setStoryFilter({ clientStore }, filter);
      const args = clientStore.set.args[0];
      expect(args).to.deep.equal(['storyFilter', filter]);
    });
  });

  describe('toggleShortcutsHelp', () => {
    it('should toggle the client sotre accordingly', () => {
      const clientStore = {
        toggle: sinon.stub(),
      };

      actions.toggleShortcutsHelp({ clientStore });
      const args = clientStore.toggle.args[0];
      expect(args).to.deep.equal(['showShortcutsHelp']);
    });
  });

  describe('selectDownPanel', () => {
    it('should set the given panel name', () => {
      const clientStore = {
        set: sinon.stub(),
      };
      const panelName = 'kkkind';

      actions.selectDownPanel({ clientStore }, panelName);
      const args = clientStore.set.args[0];
      expect(args).to.deep.equal(['selectedDownPanel', panelName]);
    });
  });
});
