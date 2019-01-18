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
    sessionStorage.getItem.mockReturnValueOnce(JSON.stringify({ foo: 'bar' }));
    localStorage.getItem.mockReturnValueOnce(JSON.stringify({ foo: 'baz', another: 'value' }));

    const store = new Store({});
    expect(store.getInitialState()).toEqual({
      foo: 'bar',
      another: 'value',
    });
  });

  it('passes getState right through', () => {
    const getState = jest.fn();
    const store = new Store({ getState });

    store.getState();

    expect(getState).toHaveBeenCalledWith();
  });

  it('sets values in React only by default', () => {
    const setState = jest.fn();
    const store = new Store({ setState });

    store.setState({ foo: 'bar' });

    expect(setState).toHaveBeenCalledWith({ foo: 'bar' });
    expect(sessionStorage.setItem).not.toHaveBeenCalled();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('sets values in React and sessionStorage if persistence === session', () => {
    const setState = jest.fn();
    const store = new Store({ setState });

    store.setState({ foo: 'bar' }, 'session');

    expect(setState).toHaveBeenCalledWith({ foo: 'bar' });
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify({ foo: 'bar' })
    );
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('sets values in React and sessionStorage if persistence === permanent', () => {
    const setState = jest.fn();
    const store = new Store({ setState });

    store.setState({ foo: 'bar' }, 'permanent');

    expect(setState).toHaveBeenCalledWith({ foo: 'bar' });
    expect(sessionStorage.setItem).not.toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify({ foo: 'bar' }));
  });

  it('properly patches existing values', () => {
    const setState = jest.fn();
    sessionStorage.getItem.mockReturnValueOnce(JSON.stringify({ foo: 'baz', another: 'value' }));
    const store = new Store({ setState });

    store.setState({ foo: 'bar' }, 'session');

    expect(setState).toHaveBeenCalledWith({ foo: 'bar' });
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify({ foo: 'bar', another: 'value' })
    );
  });
});
