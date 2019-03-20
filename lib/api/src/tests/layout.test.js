import { themes } from '@storybook/theming';
import initLayout from '../modules/layout';

describe('layout API', () => {
  describe('setOptions', () => {
    let layoutApi;
    let store;
    let currentState;

    const getLastSetStateArgs = () => {
      const { calls } = store.setState.mock;
      return calls[calls.length - 1];
    };

    beforeEach(() => {
      currentState = {
        ui: {
          enableShortcuts: true,
          sortStoriesByKind: false,
          sidebarAnimations: true,
        },
        layout: {
          isToolshown: true,
          isFullscreen: false,
          showPanel: true,
          showNav: true,
          panelPosition: 'bottom',
        },
        selectedPanel: 'storybook/actions/panel',
        theme: themes.light,
      };
      store = {
        getState: () => currentState,
        setState: jest.fn(),
      };
      layoutApi = initLayout({ store }).api;
    });

    it('should not change selectedPanel if it is undefined in the options', () => {
      layoutApi.setOptions({});

      expect(getLastSetStateArgs()[0].selectedPanel).toBeUndefined();
    });

    it('should not change selectedPanel if it is undefined in the options, but something else has changed', () => {
      layoutApi.setOptions({ panelPosition: 'right' });

      expect(getLastSetStateArgs()[0].selectedPanel).toBeUndefined();
    });

    it('should not change selectedPanel if it is currently the same', () => {
      const panelName = currentState.selectedPanel;
      layoutApi.setOptions({});
      // second call is needed to overwrite initial layout
      layoutApi.setOptions({ selectedPanel: panelName });

      expect(getLastSetStateArgs()[0].selectedPanel).toBeUndefined();
    });

    it('should not change selectedPanel if it is currently the same, but something else has changed', () => {
      layoutApi.setOptions({});
      // second call is needed to overwrite initial layout
      layoutApi.setOptions({ panelPosition: 'right', selectedPanel: currentState.selectedPanel });

      expect(getLastSetStateArgs()[0].selectedPanel).toBeUndefined();
    });

    it('should set selectedPanel initially', () => {
      const panelName = 'storybook/a11y/panel';
      layoutApi.setOptions({ selectedPanel: panelName });

      expect(getLastSetStateArgs()[0].selectedPanel).toEqual(panelName);
    });

    it('should change selectedPanel if it is defined in the options and is different', () => {
      const panelName = 'storybook/a11y/panel';
      layoutApi.setOptions({});
      layoutApi.setOptions({ selectedPanel: panelName });

      expect(getLastSetStateArgs()[0].selectedPanel).toEqual(panelName);
    });
  });
});
