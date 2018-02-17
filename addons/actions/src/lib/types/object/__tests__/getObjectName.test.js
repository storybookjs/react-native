import getObjectName from '../getObjectName';

class A {}
const a = new A();
function B() {}
const b = new B();

describe('getObjectName', () => {
  it('get name of instance', () => {
    expect(getObjectName(a)).toBe('A');
  });

  it('get name of function', () => {
    expect(getObjectName(B)).toBe('B');
  });

  it('get constructor name', () => {
    expect(getObjectName(b)).toBe('B');
  });
});
