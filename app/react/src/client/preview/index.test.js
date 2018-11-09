/* eslint-disable global-require */
describe('preview', () => {
  afterEach(() => {
    jest.resetModules();
  });

  const isFunction = value => typeof value === 'function';

  it('should return the client api in a browser environment', () => {
    const api = require('.');
    expect(Object.keys(api).length).toBeGreaterThan(0);
    expect(Object.values(api).every(isFunction)).toEqual(true);
  });

  it('should return the client api in a node.js environment', () => {
    jest.mock('global', () => ({
      document: undefined,
      window: undefined,
    }));
    const api = require('.');
    expect(Object.keys(api).length).toBeGreaterThan(0);
    expect(Object.values(api).every(isFunction)).toEqual(true);
  });
});
