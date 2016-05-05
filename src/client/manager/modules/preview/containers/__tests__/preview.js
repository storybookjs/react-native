import { expect } from 'chai';
import sinon from 'sinon';
import { composer } from '../preview';
const { describe, it } = global;

describe('manager.preview.containers.preview', () => {
  describe('composer', () => {
    it('should provide the URL to the container', () => {
      const dataId = 'aaa233';
      const state = {
        core: { dataId },
      };

      const reduxStore = {
        getState: () => (state),
      };

      const onData = sinon.stub();
      const context = () => ({ reduxStore });
      composer({ context }, onData);

      const error = onData.args[0][0];
      const props = onData.args[0][1];

      expect(error).to.be.equal(null);
      expect(props).to.deep.equal({
        url: `iframe.html?dataId=${dataId}`,
      });
    });
  });
});
