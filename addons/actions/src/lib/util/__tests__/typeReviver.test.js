import typeReviver from '../typeReviver';
import {
  objectType,
  dateType,
  functionType,
  infinityType,
  nanType,
  regexpType,
  symbolType,
  undefinedType,
} from '../../types';

const date = '2017-12-02T11:13:22.492Z';

describe('typeReviver', () => {
  it('Revives object name', () => {
    expect(typeReviver({ [objectType.KEY]: 'C' }).value.constructor.name).toEqual('C');
  });
  it('Revives Date', () => {
    expect(typeReviver({ [dateType.KEY]: date })).toEqual({
      value: new Date(date),
    });
  });

  it('Revives Function', () => {
    expect(typeReviver({ [functionType.KEY]: 'A' }).value.name).toEqual('A');
  });

  it('Revives Infinity', () => {
    expect(typeReviver({ [infinityType.KEY]: true })).toEqual({ value: Infinity });
  });

  it('Revives -Infinity', () => {
    expect(typeReviver({ [infinityType.KEY]: false })).toEqual({ value: -Infinity });
  });

  it('Revives NaN', () => {
    expect(typeReviver({ [nanType.KEY]: true })).toEqual({ value: NaN });
  });

  it('Revives Symbol', () => {
    expect(typeReviver({ [symbolType.KEY]: 'A' }).value.toString()).toEqual(Symbol('A').toString());
  });

  it('Revives undefined', () => {
    expect(typeReviver({ [undefinedType.KEY]: true })).toEqual({ value: undefined });
  });

  it('Revives RegExp', () => {
    expect(typeReviver({ [regexpType.KEY]: '/works/g' })).toEqual({ value: /works/g });
  });
});
