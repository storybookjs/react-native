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

    it('should put the correct URL and state to pushState', done => {
      const state = {
        selectedKind: 'kk',
        selectedStory: 'ss',
        customQueryParams: {
          customText: 'test'
        },
        shortcutOptions: {
          goFullScreen: false,
          showDownPanel: true,
          showLeftPanel: true,
          downPanelInRight: true
        },
        selectedDownPanel: 'pp'
      };

      const clientStore = {
        getAll: () => state
      };

      // eslint-disable-next-line max-len
      const url = '?customText=test&selectedKind=kk&selectedStory=ss&full=0&down=1&left=1&panelRight=1&downPanel=pp';

      const pushState = {
        url,
        selectedKind: 'kk',
        selectedStory: 'ss',
        full: false,
        down: true,
        left: true,
        panelRight: true,
        downPanel: 'pp',
        customText: 'test'
      };

      const originalPushState = window.history.pushState;
      window.history.pushState = function(s, t, u) {
        expect(s).to.deep.equal(pushState);
        expect(u).to.be.equal(pushState.url);
        done();
      };
      changeUrl(clientStore);
      window.history.pushState = originalPushState;
    });
  });

  describe('handleInitialUrl', () => {
    it('should call the correct action according to URL', () => {
      const actions = {
        api: {
          selectStory: sinon.mock(),
          setQueryParams: sinon.mock()
        },
        shortcuts: {
          setOptions: sinon.mock()
        },
        ui: {
          selectDownPanel: sinon.mock()
        }
      };

      // eslint-disable-next-line max-len
      const url = '?selectedKind=kk&selectedStory=ss&full=1&down=0&left=0&panelRight=0&downPanel=test&customText=teststring';

      const location = {
        search: url
      };
      window.location.search = url;
      handleInitialUrl(actions, location);

      expect(actions.api.selectStory.callCount).to.be.equal(1);
      expect(actions.shortcuts.setOptions.callCount).to.be.equal(1);
      expect(actions.ui.selectDownPanel.callCount).to.be.equal(1);
      /* eslint-disable no-unused-expressions */
      expect(
        actions.shortcuts.setOptions.calledWith({
          goFullScreen: true,
          showDownPanel: false,
          showLeftPanel: false,
          downPanelInRight: false
        })
      ).to.be.true;
      expect(actions.ui.selectDownPanel.calledWith('test')).to.be.true;
      expect(actions.api.setQueryParams.calledWith({ customText: 'teststring' })).to.be.true;
      /* eslint-enable no-unused-expressions */
    });
  });
});
