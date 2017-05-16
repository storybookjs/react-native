import initPanels from './init_panels';

describe('manager.ui.config.init_panels', () => {
  test('should call the selectDownPanel with first panel name', () => {
    const actions = {
      ui: {
        selectDownPanel: jest.fn(),
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

    expect(actions.ui.selectDownPanel).toHaveBeenCalledWith('test1');
  });
});
