import genPoddaLoader from '../gen_podda_loader';
import Podda from 'podda';
import { expect } from 'chai';
import sinon from 'sinon';
const { describe, it } = global;

describe('manager.ui.libs.gen_podda_loader', () => {
  describe('mapper', () => {
    it('should map the podda store state', () => {
      const aa = 10;
      const bb = 20;
      const cc = 40;
      const mapper = (state) => {
        return {
          aa: state.aa,
          bb: state.bb,
        };
      };

      const clientStore = new Podda({ aa, bb, cc });
      const loader = genPoddaLoader(mapper);

      const onData = sinon.stub();
      loader({}, onData, { context: () => ({ clientStore }) });
      expect(onData.args[0]).to.deep.equal([
        null,
        { aa, bb },
      ]);
    });

    it('should get props', () => {
      const aa = 10;
      const bb = 20;
      const cc = 40;
      const mapper = (state, props) => {
        return {
          aa: props.aa,
          bb: props.bb,
        };
      };

      const clientStore = new Podda();
      const loader = genPoddaLoader(mapper);

      const onData = sinon.stub();
      loader({ aa, bb, cc }, onData, { context: () => ({ clientStore }) });
      expect(onData.args[0]).to.deep.equal([
        null,
        { aa, bb },
      ]);
    });

    it('should get env', () => {
      const aa = 10;
      const bb = 20;
      const cc = 40;
      const mapper = (state, props, env) => {
        return {
          aa: env.aa,
          bb: env.bb,
        };
      };

      const clientStore = new Podda();
      const loader = genPoddaLoader(mapper);

      const onData = sinon.stub();
      loader({}, onData, { context: () => ({ clientStore }), aa, bb, cc });
      expect(onData.args[0]).to.deep.equal([
        null,
        { aa, bb },
      ]);
    });
  });

  describe('core', () => {
    it('should handle errors in the mapper', () => {
      const mapper = () => {
        throw new Error('this is the error');
      };

      const clientStore = new Podda();
      const loader = genPoddaLoader(mapper);

      const onData = sinon.stub();
      loader({}, onData, { context: () => ({ clientStore }) });
      expect(onData.args[0][0]).to.match(/this is the error/);
    });

    it('should run when the podda store changed', () => {
      const aa = 10;
      const bb = 20;
      const cc = 40;
      const mapper = (state) => {
        return {
          aa: state.aa,
          bb: state.bb,
        };
      };

      const clientStore = new Podda({ aa, bb, cc });
      const loader = genPoddaLoader(mapper);

      const onData = sinon.stub();
      loader({ aa, bb, cc }, onData, { context: () => ({ clientStore }) });
      clientStore.set('aa', 1000);
      expect(onData.args[1]).to.deep.equal([
        null,
        { aa: 1000, bb },
      ]);
    });

    it('should not run when podda subscription stopped', () => {
      const aa = 10;
      const bb = 20;
      const cc = 40;
      const mapper = (state) => {
        return {
          aa: state.aa,
          bb: state.bb,
        };
      };

      const clientStore = new Podda({ aa, bb, cc });
      const loader = genPoddaLoader(mapper);

      const onData = sinon.stub();
      const stop = loader({ aa, bb, cc }, onData, { context: () => ({ clientStore }) });
      stop();
      clientStore.set('aa', 1000);
      expect(onData.callCount).to.be.equal(1);
    });
  });
});
