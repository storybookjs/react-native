import { memorize, singleton } from './decorators';

describe('Test on functional helpers: memorize', () => {
  it('should memorize the calculated result', () => {
    // setup
    const someFn = jest.fn(x => [x]);
    const someFnMemo = memorize(someFn);

    // exercise
    const resultA = someFnMemo(1);
    const resultB = someFnMemo(2);
    const resultC = someFnMemo(1);

    // assertion
    expect(someFn).toHaveBeenCalledTimes(2);
    expect(resultA).toEqual(someFn(1));
    expect(resultA).not.toEqual(resultB);
    expect(resultA).toBe(resultC);
    expect(resultB).not.toEqual(resultC);
  });

  it('should memorize based on the second argument', () => {
    // setup
    const someFn = jest.fn((x, y) => [x, y]);
    const someFnMemo = memorize(someFn, (x, y) => y);

    // exercise
    const resultA = someFnMemo(1, 2);
    const resultB = someFnMemo(2, 2);
    const resultC = someFnMemo(1, 3);

    // assertion
    expect(someFn).toHaveBeenCalledTimes(2);
    expect(resultA).toEqual(someFn(1, 2));
    expect(resultA).toBe(resultB);
    expect(resultA).not.toEqual(resultC);
    expect(resultB).not.toEqual(resultC);
  });
});

describe('Test on functional helpers: singleton', () => {
  it('should make a function singleton', () => {
    const someFn = jest.fn((x, y, z) => [x, y, z]);
    const someFnSingleton = singleton(someFn);

    // exercise
    const resultA = someFnSingleton(1, 2, 3);
    const resultB = someFnSingleton(4, 5, 6);
    const resultC = someFnSingleton(7, 8, 9);

    // assertion
    expect(someFn).toHaveBeenCalledTimes(1);
    expect(resultA).toEqual(someFn(1, 2, 3));
    expect(resultA).toBe(resultB);
    expect(resultA).toBe(resultC);
    expect(resultB).toBe(resultC);
  });
});
