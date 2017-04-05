import initPanels from '../init_panels';
import { expect } from 'chai';
import sinon from 'sinon';
const { describe, it } = global;

describe('manager.ui.config.init_panels', () => {
  it('should call the selectDownPanel with first panel name', () => {
    const actions = {
      ui: {
        selectDownPanel: sinon.mock()
      }
    };

    const provider = {
      getPanels() {
        return {
          test1: {},
          test2: {},
          test3: {}
        };
      }
    };

    initPanels({ provider }, actions);

    /* eslint-disable no-unused-expressions */
    expect(actions.ui.selectDownPanel.calledWith('test1')).to.be.true;
    /* eslint-enable no-unused-expressions */
  });
});
