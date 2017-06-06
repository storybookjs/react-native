import Podda from 'podda';
import genPoddaLoader from './gen_podda_loader';

describe('manager.ui.libs.gen_podda_loader', () => {
  describe('mapper', () => {
    it('should map the podda store state', () => {
      const aa = 10;
      const bb = 20;
      const cc = 40;
      const mapper = state => ({
        aa: state.aa,
        bb: state.bb,
      });
      const clientStore = new Podda({ aa, bb, cc });
      const loader = genPoddaLoader(mapper);

      const onData = jest.fn();
      loader({}, onData, { context: () => ({ clientStore }) });

      expect(onData).toHaveBeenCalledWith(null, { aa, bb });
    });

    it('should get props', () => {
      const aa = 10;
      const bb = 20;
      const cc = 40;
      const mapper = (state, props) => ({
        aa: props.aa,
        bb: props.bb,
      });
      const clientStore = new Podda();
      const loader = genPoddaLoader(mapper);

      const onData = jest.fn();
      loader({ aa, bb, cc }, onData, { context: () => ({ clientStore }) });

      expect(onData).toHaveBeenCalledWith(null, { aa, bb });
    });

    it('should get env', () => {
      const aa = 10;
      const bb = 20;
      const cc = 40;
      const mapper = (state, props, env) => ({
        aa: env.aa,
        bb: env.bb,
      });

      const clientStore = new Podda();
      const loader = genPoddaLoader(mapper);

      const onData = jest.fn();
      loader({}, onData, { context: () => ({ clientStore }), aa, bb, cc });

      expect(onData).toHaveBeenCalledWith(null, { aa, bb });
    });
  });

  describe('core', () => {
    it('should handle errors in the mapper', () => {
      const mapper = () => {
        throw new Error('this is the error');
      };
      const clientStore = new Podda();
      const loader = genPoddaLoader(mapper);

      const onData = jest.fn();
      loader({}, onData, { context: () => ({ clientStore }) });

      expect(onData.mock.calls[0].toString()).toMatch(/this is the error/);
    });

    it('should run when the podda store changed', () => {
      const aa = 10;
      const bb = 20;
      const cc = 40;
      const mapper = state => ({
        aa: state.aa,
        bb: state.bb,
      });
      const clientStore = new Podda({ aa, bb, cc });
      const loader = genPoddaLoader(mapper);

      const onData = jest.fn();
      loader({ aa, bb, cc }, onData, { context: () => ({ clientStore }) });
      clientStore.set('aa', 1000);

      expect(onData).toHaveBeenCalledWith(null, { aa: 1000, bb });
    });

    it('should not run when podda subscription stopped', () => {
      const aa = 10;
      const bb = 20;
      const cc = 40;
      const mapper = state => ({
        aa: state.aa,
        bb: state.bb,
      });
      const clientStore = new Podda({ aa, bb, cc });
      const loader = genPoddaLoader(mapper);

      const onData = jest.fn();
      const stop = loader({ aa, bb, cc }, onData, {
        context: () => ({ clientStore }),
      });
      stop();
      clientStore.set('aa', 1000);

      expect(onData).toHaveBeenCalled();
    });
  });
});
