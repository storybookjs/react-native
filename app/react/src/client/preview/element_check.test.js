import React from 'react';
import isReactRenderable, { isValidFiberElement, isPriorToFiber } from './element_check';

describe('element_check.utils.isValidFiberElement', () => {
  it('should accept to render a string', () => {
    const string = 'react is awesome';

    expect(isValidFiberElement(string)).toBe(true);
  });

  it('should accept to render a number', () => {
    const number = 42;

    expect(isValidFiberElement(number)).toBe(true);
  });

  it('should accept to render a valid React element', () => {
    const element = <button type="button">Click me</button>;

    expect(isValidFiberElement(element)).toBe(true);
  });

  it("shouldn't accept to render an arbitrary object", () => {
    const object = { key: 'bee bop' };

    expect(isValidFiberElement(object)).toBe(false);
  });

  it("shouldn't accept to render a function", () => {
    const noop = () => {};

    expect(isValidFiberElement(noop)).toBe(false);
  });

  it("shouldn't accept to render undefined", () => {
    expect(isValidFiberElement(undefined)).toBe(false);
  });
});

describe('element_check.utils.isPriorToFiber', () => {
  it('should return true if React version is prior to Fiber (< 16)', () => {
    const oldVersion = '0.14.5';
    const version = '15.5.4';

    expect(isPriorToFiber(oldVersion)).toBe(true);
    expect(isPriorToFiber(version)).toBe(true);
  });

  it('should return false if React version is using Fiber features (>= 16)', () => {
    const alphaVersion = '16.0.0-alpha.13';
    const version = '18.3.1';

    expect(isPriorToFiber(alphaVersion)).toBe(false);
    expect(isPriorToFiber(version)).toBe(false);
  });
});

describe('element_check.isReactRenderable', () => {
  const string = 'yo';
  const number = 1337;
  const element = <span>what's up</span>;
  const array = [string, number, element];
  const object = { key: null };

  it('allows rendering React elements only prior to React Fiber', () => {
    // mutate version for the purpose of the test
    React.version = '15.5.4';

    expect(isReactRenderable(string)).toBe(false);
    expect(isReactRenderable(number)).toBe(false);
    expect(isReactRenderable(element)).toBe(true);
    expect(isReactRenderable(array)).toBe(false);
    expect(isReactRenderable(object)).toBe(false);
  });

  it('allows rendering string, numbers, arrays and React elements with React Fiber', () => {
    // mutate version for the purpose of the test
    React.version = '16.0.0-alpha.13';

    expect(isReactRenderable(string)).toBe(true);
    expect(isReactRenderable(number)).toBe(true);
    expect(isReactRenderable(element)).toBe(true);
    expect(isReactRenderable(array)).toBe(true);
    expect(isReactRenderable(object)).toBe(false);
  });
});
