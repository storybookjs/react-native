import functionType from '../';
import reservedKeywords from '../reservedKeywords';
import createFunction from '../createFunction';
import createBoundFunction from '../createBoundFunction';

const A = createFunction('A');
const B = createBoundFunction('B');
const C = createFunction();

describe('function', () => {
  it('Recognizes function', () => {
    expect(functionType.is(A)).toBe(true);
  });

  it('Serializes function', () => {
    expect(functionType.serialize(A)).toEqual({ [functionType.KEY]: 'A' });
  });

  it('Serializes anonymous function', () => {
    expect(functionType.serialize(C)).toEqual({ [functionType.KEY]: '' });
  });

  it('Serializes bound function', () => {
    expect(functionType.serialize(B)).toEqual({ [functionType.KEY]: 'bound B' });
  });

  it('Deserializes function', () => {
    const func = functionType.deserialize({ [functionType.KEY]: 'A' });

    expect(func.name).toEqual('A');
  });

  it('Deserializes bound function', () => {
    const func = functionType.deserialize({ [functionType.KEY]: 'bound B' });

    expect(func.name).toEqual('bound B');
  });

  it('Deserializes functions with reserved names', () => {
    reservedKeywords.forEach(reservedKeyword => {
      const func = functionType.deserialize({ [functionType.KEY]: reservedKeyword });

      expect(func.name).toEqual(reservedKeyword);
    });
  });
});
