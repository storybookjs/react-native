import initAddons, { types } from '../modules/addons';

const PANELS = {
  a11y: {
    title: 'Accessibility',
    paramKey: 'a11y',
  },
  actions: {
    title: 'Actions',
    paramKey: 'actions',
  },
  knobs: {
    title: 'Knobs',
    paramKey: 'knobs',
  },
};

const provider = {
  getElements(type) {
    if (type === types.PANEL) {
      return PANELS;
    }
    return null;
  },
};

const store = {
  getState: () => ({
    selectedPanel: '',
  }),
  setState: jest.fn(),
};

describe('Addons API', () => {
  describe('#getElements', () => {
    it('should return provider elements', () => {
      // given
      const { api } = initAddons({ provider, store });

      // when
      const panels = api.getElements(types.PANEL);

      // then
      expect(panels).toBe(PANELS);
    });
  });

  describe('#getPanels', () => {
    it('should return provider panels', () => {
      // given
      const { api } = initAddons({ provider, store });

      // when
      const panels = api.getPanels();

      // then
      expect(panels).toBe(PANELS);
    });
  });

  describe('#getPanelsForStory', () => {
    it('should return all panels by default', () => {
      // given
      const { api } = initAddons({ provider, store });

      // when
      const filteredPanels = api.getPanelsForStory();

      // then
      expect(filteredPanels).toBe(PANELS);
    });

    it('should filter disabled addons', () => {
      // given
      const { api } = initAddons({ provider, store });
      const storyParameters = {
        a11y: { disabled: true },
      };

      // when
      const filteredPanels = api.getPanelsForStory(storyParameters);

      // then
      expect(filteredPanels).toEqual({
        actions: PANELS.actions,
        knobs: PANELS.knobs,
      });
    });
  });

  describe('#getSelectedPanel', () => {
    it('should return provider panels', () => {
      // given
      const storeWithSelectedPanel = {
        getState: () => ({
          selectedPanel: 'actions',
        }),
        setState: jest.fn(),
      };
      const { api } = initAddons({ provider, store: storeWithSelectedPanel });

      // when
      const selectedPanel = api.getSelectedPanel();

      // then
      expect(selectedPanel).toBe('actions');
    });

    it('should return first panel when selected is not a panel', () => {
      // given
      const storeWithSelectedPanel = {
        getState: () => ({
          selectedPanel: 'unknown',
        }),
        setState: jest.fn(),
      };
      const { api } = initAddons({ provider, store: storeWithSelectedPanel });

      // when
      const selectedPanel = api.getSelectedPanel();

      // then
      expect(selectedPanel).toBe('a11y');
    });
  });

  describe('#setSelectedPanel', () => {
    it('should set value inn store', () => {
      // given
      const setState = jest.fn();
      const storeWithSelectedPanel = {
        getState: () => ({
          selectedPanel: 'actions',
        }),
        setState,
      };
      const { api } = initAddons({ provider, store: storeWithSelectedPanel });
      expect(setState).not.toHaveBeenCalled();

      // when
      api.setSelectedPanel('knobs');

      // then
      expect(setState).toHaveBeenCalledWith({ selectedPanel: 'knobs' }, { persistence: 'session' });
    });
  });
});
