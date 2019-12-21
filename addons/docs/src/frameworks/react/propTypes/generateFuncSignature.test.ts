import { generateFuncSignature, generateShortFuncSignature } from './generateFuncSignature';
import { parseJsDoc } from '../../../lib/jsdocParser';

describe('generateFuncSignature', () => {
  it('should return an empty string when there is no @params and @returns tags', () => {
    const result = generateFuncSignature(null, null);

    expect(result).toBe('');
  });

  it('should return a signature with a single arg when there is a @param tag with a name', () => {
    const { params, returns } = parseJsDoc('@param event').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('(event)');
  });

  it('should return a signature with a single arg when there is a @param tag with a name and a type', () => {
    const { params, returns } = parseJsDoc('@param {SyntheticEvent} event').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('(event: SyntheticEvent)');
  });

  it('should return a signature with a single arg when there is a @param tag with a name, a type and a desc', () => {
    const { params, returns } = parseJsDoc(
      '@param {SyntheticEvent} event - React event'
    ).extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('(event: SyntheticEvent)');
  });

  it('should support @param of record type', () => {
    const { params, returns } = parseJsDoc('@param {{a: number}} event').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('(event: ({a: number}))');
  });

  it('should support @param of union type', () => {
    const { params, returns } = parseJsDoc('@param {(number|boolean)} event').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('(event: (number|boolean))');
  });

  it('should support @param of array type', () => {
    const { params, returns } = parseJsDoc('@param {number[]} event').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('(event: number[])');
  });

  it('should support @param with a nullable type', () => {
    const { params, returns } = parseJsDoc('@param {?number} event').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('(event: number)');
  });

  it('should support @param with a non nullable type', () => {
    const { params, returns } = parseJsDoc('@param {!number} event').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('(event: number)');
  });

  it('should support optional @param with []', () => {
    const { params, returns } = parseJsDoc('@param {number} [event]').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('(event: number)');
  });

  it('should support optional @param with =', () => {
    const { params, returns } = parseJsDoc('@param {number=} event').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('(event: number)');
  });

  it('should support @param of type any', () => {
    const { params, returns } = parseJsDoc('@param {*} event').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('(event: any)');
  });

  it('should support multiple @param tags', () => {
    const { params, returns } = parseJsDoc(
      '@param {SyntheticEvent} event\n@param {string} customData'
    ).extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('(event: SyntheticEvent, customData: string)');
  });

  it('should return a signature with a return type when there is a @returns with a type', () => {
    const { params, returns } = parseJsDoc('@returns {string}').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('() => string');
  });

  it('should support @returns of record type', () => {
    const { params, returns } = parseJsDoc('@returns {{a: number, b: string}}').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('() => ({a: number, b: string})');
  });

  it('should support @returns of array type', () => {
    const { params, returns } = parseJsDoc('@returns {integer[]}').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('() => integer[]');
  });

  it('should support @returns of union type', () => {
    const { params, returns } = parseJsDoc('@returns {(number|boolean)}').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('() => (number|boolean)');
  });

  it('should support @returns type any', () => {
    const { params, returns } = parseJsDoc('@returns {*}').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('() => any');
  });

  it('should support @returns of type void', () => {
    const { params, returns } = parseJsDoc('@returns {void}').extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('() => void');
  });

  it('should return a full signature when there is a single @param tag and a @returns', () => {
    const { params, returns } = parseJsDoc(
      '@param {SyntheticEvent} event - React event.\n@returns {string}'
    ).extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('(event: SyntheticEvent) => string');
  });

  it('should return a full signature when there is a multiple @param tags and a @returns', () => {
    const { params, returns } = parseJsDoc(
      '@param {SyntheticEvent} event - React event.\n@param {string} data\n@returns {string}'
    ).extractedTags;
    const result = generateFuncSignature(params, returns);

    expect(result).toBe('(event: SyntheticEvent, data: string) => string');
  });
});

describe('generateShortFuncSignature', () => {
  it('should return an empty string when there is no @params and @returns tags', () => {
    const result = generateShortFuncSignature(null, null);

    expect(result).toBe('');
  });

  it('should return ( ... ) when there is @params', () => {
    const { params, returns } = parseJsDoc('@param event').extractedTags;
    const result = generateShortFuncSignature(params, returns);

    expect(result).toBe('( ... )');
  });

  it('should return ( ... ) => returnsType when there is @params and a @returns', () => {
    const { params, returns } = parseJsDoc('@param event\n@returns {string}').extractedTags;
    const result = generateShortFuncSignature(params, returns);

    expect(result).toBe('( ... ) => string');
  });

  it('should return () => returnsType when there is only a @returns', () => {
    const { params, returns } = parseJsDoc('@returns {string}').extractedTags;
    const result = generateShortFuncSignature(params, returns);

    expect(result).toBe('() => string');
  });
});
