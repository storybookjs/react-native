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
        shortcuts: {
          goFullScreen: false,
          showDownPanel: true,
          showLeftPanel: true,
        },
      };

      const reduxStore = {
        getState: () => reduxState,
      };

      const pushState = {
        url: '?selectedKind=kk&selectedStory=ss&full=0&down=1&left=1',
        selectedKind: 'kk',
        selectedStory: 'ss',
        full: false,
        down: true,
        left: true,
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
        shortcuts: {
          setLayout: sinon.mock(),
        },
      };

      const url = '?selectedKind=kk&selectedStory=ss&full=1&down=0&left=0';

      const location = {
        search: url,
      };
      window.location.search = url;
      handleInitialUrl(actions, location);

      expect(actions.api.selectStory.callCount).to.be.equal(1);
      expect(actions.shortcuts.setLayout.callCount).to.be.equal(1);
      /* eslint-disable no-unused-expressions */
      expect(actions.shortcuts.setLayout.calledWith({
        goFullScreen: true,
        showDownPanel: false,
        showLeftPanel: false,
      })).to.be.true;
      /* eslint-enable no-unused-expressions */
    });
  });
});
