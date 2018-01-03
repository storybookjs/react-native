import typeReplacer from '../typeReplacer';
import {
  dateType,
  functionType,
  infinityType,
  nanType,
  regexpType,
  symbolType,
  undefinedType,
} from '../../types';

function A() {}

const date = '2017-12-02T11:13:22.492Z';

describe('typeReplacer', () => {
  it('Replaces Date', () => {
    expect(typeReplacer(new Date(date))).toEqual({
      value: { [dateType.KEY]: date },
    });
  });

  it('Replaces Function', () => {
    expect(typeReplacer(A)).toEqual({
      value: { [functionType.KEY]: 'A' },
    });
  });
  it('Replaces Infinity', () => {
    expect(typeReplacer(Infinity)).toEqual({
      value: { [infinityType.KEY]: true },
    });
  });
  it('Replaces NaN', () => {
    expect(typeReplacer(NaN)).toEqual({
      value: { [nanType.KEY]: true },
    });
  });
  it('Replaces Symbol', () => {
    expect(typeReplacer(Symbol('A'))).toEqual({
      value: { [symbolType.KEY]: 'A' },
    });
  });
  it('Replaces undefined', () => {
    expect(typeReplacer(undefined)).toEqual({
      value: { [undefinedType.KEY]: true },
    });
  });
  it('Replaces RegExp', () => {
    expect(typeReplacer(/works/g)).toEqual({
      value: { [regexpType.KEY]: '/works/g' },
    });
  });
});
