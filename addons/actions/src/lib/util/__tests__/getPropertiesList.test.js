import { File, Math } from 'global';
import getPropertiesList from '../getPropertiesList';

describe('getPropertiesList', () => {
  it('for plain object', () => {
    expect(getPropertiesList({ a: 'A', b: 'B' })).toEqual(['a', 'b']);
  });

  it('for Math object', () => {
    expect(getPropertiesList(Math)).toEqual([
      'abs',
      'acos',
      'acosh',
      'asin',
      'asinh',
      'atan',
      'atanh',
      'atan2',
      'ceil',
      'cbrt',
      'expm1',
      'clz32',
      'cos',
      'cosh',
      'exp',
      'floor',
      'fround',
      'hypot',
      'imul',
      'log',
      'log1p',
      'log2',
      'log10',
      'max',
      'min',
      'pow',
      'random',
      'round',
      'sign',
      'sin',
      'sinh',
      'sqrt',
      'tan',
      'tanh',
      'trunc',
      'E',
      'LN10',
      'LN2',
      'LOG10E',
      'LOG2E',
      'PI',
      'SQRT1_2',
      'SQRT2',
    ]);
  });

  it('for File object', () => {
    const file = new File([''], 'filename.txt', { type: 'text/plain', lastModified: new Date() });

    expect(getPropertiesList(file)).toEqual(['name', 'lastModified', 'size', 'type', 'isClosed']);
  });
});
