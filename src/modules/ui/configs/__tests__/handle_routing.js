import { changeUrl, handleInitialUrl, config } from '../handle_routing';
import { expect } from 'chai';
const { describe, it } = global;
import sinon from 'sinon';

describe('manager.ui.config.handle_routing', () => {
  describe('changeUrl', () => {
    it('should not do anything if insidePopState=true', () => {
      config.insidePopState = true;
      // This should throws an error if insidePopState = false
      changeUrl(null);
      config.insidePopState = false;
    });
    it('should put the correct URL and state to pushState', (done) => {
      const reduxState = {
        api: {
          selectedKind: 'kk',
          selectedStory: 'ss',
        },
      };

      const reduxStore = {
        getState: () => reduxState,
      };

      const pushState = {
        url: '?selectedKind=kk&selectedStory=ss',
        selectedKind: 'kk',
        selectedStory: 'ss',
      };

      const originalPushState = window.history.pushState;
      window.history.pushState = function (s, t, u) {
        expect(s).to.deep.equal(pushState);
        expect(u).to.be.equal(pushState.url);
        done();
      };
      changeUrl(reduxStore);
      window.history.pushState = originalPushState;
    });
  });

  describe('handleInitialUrl', () => {
    it('should call the correct action according to URL', () => {
      const actions = {
        api: {
          selectStory: sinon.mock(),
        },
      };

      const location = {
        search: '?selectedKind=kk&selectedStory=ss',
      };
      window.location.search = '?selectedKind=kk&selectedStory=ss';
      handleInitialUrl(actions, location);

      expect(actions.api.selectStory.callCount).to.be.equal(1);
    });
  });
});
