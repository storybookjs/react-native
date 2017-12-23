import initPanels from './init_panels';

describe('manager.ui.config.init_panels', () => {
  test('should call the selectAddonPanel with first panel name', () => {
    const actions = {
      ui: {
        selectAddonPanel: jest.fn(),
      },
    };

    const provider = {
      getPanels() {
        return {
          test1: {},
          test2: {},
          test3: {},
        };
      },
    };

    initPanels({ provider }, actions);

    expect(actions.ui.selectAddonPanel).toHaveBeenCalledWith('test1');
  });
});
