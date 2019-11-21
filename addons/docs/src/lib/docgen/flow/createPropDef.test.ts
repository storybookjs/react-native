import { isNil } from 'lodash';
import { createFlowPropDef } from './createPropDef';
import { DocgenInfo, DocgenFlowType } from '../types';

const PROP_NAME = 'propName';

function createDocgenInfo({
  type,
  defaultValue,
  ...rest
}: {
  type: DocgenFlowType;
  defaultValue?: string;
}): DocgenInfo {
  return {
    flowType: type,
    defaultValue: !isNil(defaultValue) ? { value: defaultValue } : undefined,
    required: false,
    ...rest,
  };
}

describe('type', () => {
  ['string', 'number', 'boolean', 'any', 'void', 'Object', 'String', 'MyClass', 'literal'].forEach(
    x => {
      it(`should support ${x}`, () => {
        const docgenInfo = createDocgenInfo({
          type: { name: x },
        });

        const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

        expect(type.summary).toBe(x);
        expect(type.detail).toBeUndefined();
      });
    }
  );

  ['Array', 'Class', 'MyClass'].forEach(x => {
    it(`should support untyped ${x}`, () => {
      const docgenInfo = createDocgenInfo({
        type: { name: x },
      });

      const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

      expect(type.summary).toBe(x);
      expect(type.detail).toBeUndefined();
    });

    it(`should support typed ${x}`, () => {
      const docgenInfo = createDocgenInfo({
        type: {
          name: x,
          elements: [
            {
              name: 'any',
            },
          ],
          raw: `${x}<any>`,
        },
      });

      const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

      expect(type.summary).toBe(`${x}<any>`);
      expect(type.detail).toBeUndefined();
    });
  });

  it('should support short object signature', () => {
    const docgenInfo = createDocgenInfo({
      type: {
        name: 'signature',
        type: 'object',
        raw: '{ foo: string, bar?: mixed }',
        signature: {
          properties: [
            {
              key: 'foo',
              value: {
                name: 'string',
                required: true,
              },
            },
            {
              key: 'bar',
              value: {
                name: 'mixed',
                required: false,
              },
            },
          ],
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('{ foo: string, bar?: mixed }');
    expect(type.detail).toBeUndefined();
  });

  it('should support long object signature', () => {
    const docgenInfo = createDocgenInfo({
      type: {
        name: 'signature',
        type: 'object',
        raw: '{ (x: string): void, prop: string }',
        signature: {
          properties: [
            {
              key: 'prop',
              value: {
                name: 'string',
                required: true,
              },
            },
          ],
          constructor: {
            name: 'signature',
            type: 'function',
            raw: '(x: string): void',
            signature: {
              arguments: [
                {
                  name: 'x',
                  type: {
                    name: 'string',
                  },
                },
              ],
              return: {
                name: 'void',
              },
            },
          },
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('object');
    expect(type.detail).toBe('{ (x: string): void, prop: string }');
  });

  it('should support func signature', () => {
    const docgenInfo = createDocgenInfo({
      type: {
        name: 'signature',
        type: 'function',
        raw: '(x: string) => void',
        signature: {
          arguments: [
            {
              name: 'x',
              type: {
                name: 'string',
              },
            },
          ],
          return: {
            name: 'void',
          },
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('(x: string) => void');
    expect(type.detail).toBeUndefined();
  });

  it('should support tuple', () => {
    const docgenInfo = createDocgenInfo({
      type: {
        name: 'tuple',
        raw: '[foo, "value", number]',
        elements: [
          {
            name: 'foo',
          },
          {
            name: 'literal',
            value: '"value"',
          },
          {
            name: 'number',
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('[foo, "value", number]');
  });

  it('should support union', () => {
    const docgenInfo = createDocgenInfo({
      type: {
        name: 'union',
        raw: 'number | string',
        elements: [
          {
            name: 'number',
          },
          {
            name: 'string',
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('number | string');
  });

  it('should support intersection', () => {
    const docgenInfo = createDocgenInfo({
      type: {
        name: 'intersection',
        raw: 'number & string',
        elements: [
          {
            name: 'number',
          },
          {
            name: 'string',
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('number & string');
  });
});
