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
          showAddonPanel: true,
          showStoriesPanel: true,
          addonPanelInRight: true,
        },
        selectedAddonPanel: 'pp',
      };
      const clientStore = {
        getAll: () => state,
      };
      const url =
        '?customText=test&selectedKind=kk&selectedStory=ss&full=0&addons=1&stories=1&panelRight=1&addonPanel=pp';

      const pushState = {
        url,
        selectedKind: 'kk',
        selectedStory: 'ss',
        full: false,
        addons: true,
        stories: true,
        panelRight: true,
        addonPanel: 'pp',
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
          selectAddonPanel: jest.fn(),
        },
      };
      const url =
        '?selectedKind=kk&selectedStory=ss&full=1&addons=0&stories=0&panelRight=0&addonPanel=test&customText=teststring';

      const location = {
        search: url,
      };
      window.location.search = url;
      handleInitialUrl(actions, location);

      expect(actions.api.selectStory).toHaveBeenCalled();
      expect(actions.shortcuts.setOptions).toHaveBeenCalled();
      expect(actions.ui.selectAddonPanel).toHaveBeenCalled();
      expect(actions.shortcuts.setOptions).toHaveBeenCalledWith({
        goFullScreen: true,
        showAddonPanel: false,
        showStoriesPanel: false,
        addonPanelInRight: false,
      });
      expect(actions.ui.selectAddonPanel).toHaveBeenCalledWith('test');
      expect(actions.api.setQueryParams).toHaveBeenCalledWith({
        customText: 'teststring',
      });
    });

    test('should handle URLs with outdated param names', () => {
      const actions = {
        api: {
          selectStory: jest.fn(),
          setQueryParams: jest.fn(),
        },
        shortcuts: {
          setOptions: jest.fn(),
        },
        ui: {
          selectAddonPanel: jest.fn(),
        },
      };
      const url = '?down=0&left=0&downPanel=test';

      const location = {
        search: url,
      };
      window.location.search = url;
      handleInitialUrl(actions, location);

      expect(actions.shortcuts.setOptions).toHaveBeenCalled();
      expect(actions.shortcuts.setOptions).toHaveBeenCalledWith({
        goFullScreen: false,
        showAddonPanel: false,
        showStoriesPanel: false,
        addonPanelInRight: false,
      });
      expect(actions.ui.selectAddonPanel).toHaveBeenCalledWith('test');
    });
  });
});
