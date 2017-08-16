import { window } from 'global';
import { changeUrl, handleInitialUrl, config } from './handle_routing';

describe('manager.ui.config.handle_routing', () => {
  describe('changeUrl', () => {
    test('should not do anything if insidePopState=true', () => {
      config.insidePopState = true;
      // This should throws an error if insidePopState = false
      changeUrl(null);
      config.insidePopState = false;
    });

    test('should put the correct URL and state to pushState', done => {
      const state = {
        selectedKind: 'kk',
        selectedStory: 'ss',
        customQueryParams: {
          customText: 'test',
        },
        shortcutOptions: {
          goFullScreen: false,
          showDownPanel: true,
          showLeftPanel: true,
          downPanelInRight: true,
        },
        selectedAddonPanel: 'pp',
      };
      const clientStore = {
        getAll: () => state,
      };
      const url =
        '?customText=test&selectedKind=kk&selectedStory=ss&full=0&down=1&left=1&panelRight=1&downPanel=pp';

      const pushState = {
        url,
        selectedKind: 'kk',
        selectedStory: 'ss',
        full: false,
        down: true,
        left: true,
        panelRight: true,
        downPanel: 'pp',
        customText: 'test',
      };
      const originalPushState = window.history.pushState;
      window.history.pushState = (s, t, u) => {
        expect(s).toEqual(pushState);
        expect(u).toBe(pushState.url);
        done();
      };

      changeUrl(clientStore);

      window.history.pushState = originalPushState;
    });
  });

  describe('handleInitialUrl', () => {
    test('should call the correct action according to URL', () => {
      const actions = {
        api: {
          selectStory: jest.fn(),
          setQueryParams: jest.fn(),
        },
        shortcuts: {
          setOptions: jest.fn(),
        },
        ui: {
          selectDownPanel: jest.fn(),
        },
      };
      const url =
        '?selectedKind=kk&selectedStory=ss&full=1&down=0&left=0&panelRight=0&downPanel=test&customText=teststring';

      const location = {
        search: url,
      };
      window.location.search = url;
      handleInitialUrl(actions, location);

      expect(actions.api.selectStory).toHaveBeenCalled();
      expect(actions.shortcuts.setOptions).toHaveBeenCalled();
      expect(actions.ui.selectDownPanel).toHaveBeenCalled();
      expect(actions.shortcuts.setOptions).toHaveBeenCalledWith({
        goFullScreen: true,
        showDownPanel: false,
        showLeftPanel: false,
        downPanelInRight: false,
      });
      expect(actions.ui.selectDownPanel).toHaveBeenCalledWith('test');
      expect(actions.api.setQueryParams).toHaveBeenCalledWith({
        customText: 'teststring',
      });
    });
  });
});
