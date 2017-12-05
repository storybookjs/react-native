import getClassName from '../getClassName';

class A {}
const a = new A();
function B() {}
const b = new B();

describe('getClassName', () => {
  /* Transpiled cannot be tested.
  it('get name of class',() => {
    expect(getClassName(A)).toBe('A')
  });
  */

  it('get name of class instance', () => {
    expect(getClassName(a)).toBe('A');
  });

  it('get name of function', () => {
    expect(getClassName(B)).toBe('B');
  });

  it('get constructor name', () => {
    expect(getClassName(b)).toBe('B');
  });
});
