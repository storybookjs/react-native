import actions from '../api';
import { expect } from 'chai';
import sinon from 'sinon';
import { types } from '../';
const { describe, it } = global;

describe('manager.api.actions.api', () => {
  describe('setStories', () => {
    it('should dispatch related redux action', () => {
      const reduxStore = {
        dispatch: sinon.stub(),
      };
      const stories = [{ kind: 'aa', stories: [] }];

      actions.setStories({ reduxStore }, stories);
      const action = reduxStore.dispatch.args[0][0];
      expect(action).to.deep.equal({
        type: types.SET_STORIES,
        stories,
      });
    });
  });

  describe('selectStory', () => {
    it('should dispatch related redux action', () => {
      const reduxStore = {
        dispatch: sinon.stub(),
      };
      const kind = 'kkkind';
      const story = 'ssstory';

      actions.selectStory({ reduxStore }, kind, story);
      const action = reduxStore.dispatch.args[0][0];
      expect(action).to.deep.equal({
        type: types.SELECT_STORY,
        kind,
        story,
      });
    });
  });

  describe('jumpToStory', () => {
    it('should dispatch related redux action', () => {
      const reduxStore = {
        dispatch: sinon.stub(),
      };
      const direction = -1;

      actions.jumpToStory({ reduxStore }, direction);
      const action = reduxStore.dispatch.args[0][0];
      expect(action).to.deep.equal({
        type: types.JUMP_TO_STORY,
        direction,
      });
    });
  });

  describe('clearActions', () => {
    it('should dispatch related redux action', () => {
      const reduxStore = {
        dispatch: sinon.stub(),
      };

      actions.clearActions({ reduxStore });
      const action = reduxStore.dispatch.args[0][0];
      expect(action).to.deep.equal({
        type: types.CLEAR_ACTIONS,
      });
    });
  });

  describe('addAction', () => {
    it('should dispatch related redux action', () => {
      const reduxStore = {
        dispatch: sinon.stub(),
      };
      const action = {};

      actions.addAction({ reduxStore }, action);
      const a = reduxStore.dispatch.args[0][0];
      expect(a).to.deep.equal({
        type: types.ADD_ACTION,
        action,
      });
    });
  });
});
