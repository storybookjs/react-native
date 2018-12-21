import qs from 'qs';

import initURL from './url';

jest.useFakeTimers();

describe('initial state', () => {
  it('redirects to components/* if path is blank', () => {
    const navigate = jest.fn();
    const location = { search: null };
    const {
      state: { layout },
    } = initURL({ navigate, location });

    // Nothing unexpected in layout
    expect(layout).toEqual({});
    jest.runAllTimers();
    expect(navigate).toHaveBeenCalledWith('/components/*', { replace: true });
  });

  describe('config query parameters', () => {
    it('handles full parameter', () => {
      const navigate = jest.fn();
      const location = { search: qs.stringify({ full: '1' }) };

      const {
        state: { layout },
      } = initURL({ navigate, location });

      expect(layout).toEqual({ isFullscreen: true });
    });

    it('handles nav parameter', () => {
      const navigate = jest.fn();
      const location = { search: qs.stringify({ nav: '0' }) };

      const {
        state: { layout },
      } = initURL({ navigate, location });

      expect(layout).toEqual({ showNav: false });
    });

    it('handles panel parameter, bottom', () => {
      const navigate = jest.fn();
      const location = { search: qs.stringify({ panel: 'bottom' }) };

      const {
        state: { layout },
      } = initURL({ navigate, location });

      expect(layout).toEqual({ panelPosition: 'bottom' });
    });

    it('handles panel parameter, right', () => {
      const navigate = jest.fn();
      const location = { search: qs.stringify({ panel: 'right' }) };

      const {
        state: { layout },
      } = initURL({ navigate, location });

      expect(layout).toEqual({ panelPosition: 'right' });
    });

    it('handles panel parameter, 0', () => {
      const navigate = jest.fn();
      const location = { search: qs.stringify({ panel: '0' }) };

      const {
        state: { layout },
      } = initURL({ navigate, location });

      expect(layout).toEqual({ showPanel: false });
    });
  });

  describe('legacy query parameters', () => {
    const defaultLegacyParameters = {
      selectedKind: 'kind',
      selectedStory: 'story',
      full: '0',
      addons: '1',
      stories: '1',
      panelRight: '0',
      addonPanel: 'storybook%2Factions%2Factions-panel',
    };

    it('handles defaults and routes to story', () => {
      const navigate = jest.fn();
      const location = { search: qs.stringify(defaultLegacyParameters) };
      const {
        state: { layout, selectedPanel },
      } = initURL({ navigate, location });

      // Nothing unexpected in layout
      expect(layout).toEqual({});
      // TODO: at the very least this should be unescaped
      expect(selectedPanel).toEqual('storybook%2Factions%2Factions-panel');
      jest.runAllTimers();
      expect(navigate).toHaveBeenCalledWith('/components/kind--story', { replace: true });
    });

    it('handles full parameter', () => {
      const navigate = jest.fn();
      const location = {
        search: qs.stringify({
          ...defaultLegacyParameters,
          full: '1',
        }),
      };
      const {
        state: { layout },
      } = initURL({ navigate, location });

      expect(layout).toEqual({ isFullscreen: true });
    });

    it('handles addons and stories parameters', () => {
      const navigate = jest.fn();
      const location = {
        search: qs.stringify({
          ...defaultLegacyParameters,
          addons: '0',
          stories: '0',
        }),
      };
      const {
        state: { layout },
      } = initURL({ navigate, location });

      expect(layout).toEqual({ showNav: false, showPanel: false });
    });

    it('handles panelRight parameter', () => {
      const navigate = jest.fn();
      const location = {
        search: qs.stringify({
          ...defaultLegacyParameters,
          panelRight: '1',
        }),
      };
      const {
        state: { layout },
      } = initURL({ navigate, location });

      expect(layout).toEqual({ panelPosition: 'right' });
    });
  });
});

describe('queryParams', () => {
  it('lets your read out parameters you set previously', () => {
    let state = {};
    const store = {
      setState: change => {
        state = { ...state, ...change };
      },
      getState: () => state,
    };
    const { api } = initURL({ location: { search: '' }, navigate: jest.fn(), store });

    api.setQueryParams({ foo: 'bar' });

    expect(api.getQueryParam('foo')).toEqual('bar');
  });
});
