import { localStorage, sessionStorage } from 'global';

import Store, { STORAGE_KEY } from './store';

jest.mock('global', () => ({
  sessionStorage: {
    setItem: jest.fn(),
    getItem: jest.fn(),
  },
  localStorage: {
    setItem: jest.fn(),
    getItem: jest.fn(),
  },
}));

describe('store', () => {
  it('sensibly combines local+session storage for inital state', () => {
    sessionStorage.getItem.mockReturnValueOnce(
      JSON.stringify({ foo: 'bar', combined: { a: 'b' } })
    );
    localStorage.getItem.mockReturnValueOnce(
      JSON.stringify({ foo: 'baz', another: 'value', combined: { c: 'd' } })
    );

    const store = new Store({});
    expect(store.getInitialState()).toEqual({
      foo: 'bar',
      another: 'value',
      // We don't combine subfields from the two sources.
      combined: { a: 'b' },
    });
  });

  it('passes getState right through', () => {
    const getState = jest.fn();
    const store = new Store({ getState });

    store.getState();

    expect(getState).toHaveBeenCalled();
  });

  describe('setState', () => {
    it('sets values in React only by default', async () => {
      const setState = jest.fn().mockImplementation((x, cb) => cb());
      const store = new Store({ setState });

      await store.setState({ foo: 'bar' });

      expect(setState).toHaveBeenCalledWith({ foo: 'bar' }, expect.any(Function));
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('sets values in React and sessionStorage if persistence === session', async () => {
      const setState = jest.fn().mockImplementation((x, cb) => cb());
      const store = new Store({ setState });

      await store.setState({ foo: 'bar' }, { persistence: 'session' });

      expect(setState).toHaveBeenCalledWith({ foo: 'bar' }, expect.any(Function));
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify({ foo: 'bar' })
      );
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('sets values in React and sessionStorage if persistence === permanent', async () => {
      const setState = jest.fn().mockImplementation((x, cb) => cb());
      const store = new Store({ setState });

      await store.setState({ foo: 'bar' }, { persistence: 'permanent' });

      expect(setState).toHaveBeenCalledWith({ foo: 'bar' }, expect.any(Function));
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
      expect(localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify({ foo: 'bar' })
      );
    });

    it('properly patches existing values', async () => {
      const setState = jest.fn().mockImplementation((x, cb) => cb());
      sessionStorage.getItem.mockReturnValueOnce(
        JSON.stringify({ foo: 'baz', another: 'value', combined: { a: 'b' } })
      );
      const store = new Store({ setState });

      await store.setState({ foo: 'bar', combined: { c: 'd' } }, { persistence: 'session' });

      expect(setState).toHaveBeenCalledWith(
        { foo: 'bar', combined: { c: 'd' } },
        expect.any(Function)
      );
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify({ foo: 'bar', another: 'value', combined: { c: 'd' } })
      );
    });
  });
});
