const { describe, it } = global;
import { expect } from 'chai';
import { baseComposer } from '../redux_composer';
import sinon from 'sinon';

describe('manager.ui.libs.redux_composer', function () {
  describe('running', () => {
    it('should run composer functions initially', (done) => {
      const reduxStore = {
        subscribe() {},
        getState() {},
      };

      const context = () => ({ reduxStore });
      baseComposer(done, { context }, () => {});
    });

    it('should run the composer functions for reduxStore subscribe', () => {
      let processState;
      const reduxStore = {
        subscribe(ps) {
          processState = ps;
        },
        getState() {},
      };

      const context = () => ({ reduxStore });
      const composerFn = sinon.stub();
      baseComposer(composerFn, { context }, () => {});
      processState();

      expect(composerFn.callCount).to.be.equal(2);
    });
  });

  describe('composer function', () => {
    it('should call the composer function with reduxState and props', () => {
      const reduxState = { aa: 10 };
      const reduxStore = {
        subscribe() {},
        getState: () => reduxState,
      };

      const context = () => ({ reduxStore });
      const props = { context };
      const composerFn = sinon.mock();
      baseComposer(composerFn, props, () => {});

      expect(composerFn.firstCall.args[0]).to.deep.equal(reduxState);
      expect(composerFn.firstCall.args[1]).to.be.equal(props);
    });

    it('should accept the returned data data', () => {
      const reduxStore = {
        subscribe() {},
        getState() {},
      };

      const context = () => ({ reduxStore });
      const props = { context };
      const data = { aa: 20 };

      const composerFn = () => {
        return data;
      };

      const onData = sinon.mock();
      baseComposer(composerFn, props, onData);

      expect(onData.firstCall.args[0]).to.be.equal(null);
      expect(onData.firstCall.args[1]).to.deep.equal(data);
    });

    it('should handle errors', () => {
      const reduxStore = {
        subscribe() {},
        getState() {},
      };

      const context = () => ({ reduxStore });
      const props = { context };
      const error = new Error('Hello Error');

      const composerFn = () => {
        throw error;
      };

      const onData = sinon.mock();
      baseComposer(composerFn, props, onData);

      expect(onData.firstCall.args[0]).to.be.equal(error);
      expect(onData.firstCall.args[1]).to.be.equal(undefined);
    });
  });
});
