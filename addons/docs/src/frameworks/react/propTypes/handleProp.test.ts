/* eslint-disable no-underscore-dangle */

import { PropSummaryValue, PropDef } from '@storybook/components';
import { stringify } from 'querystring';
import { Component } from '../../../blocks/shared';
import { extractPropsFromDocgen } from '../../../lib/docgen';
import { enhancePropTypesProp } from './handleProp';

const DOCGEN_SECTION = 'props';
const PROP_NAME = 'propName';

function createComponent(docgenInfo: Record<string, any>): Component {
  const component = () => {};
  // @ts-ignore
  component.__docgenInfo = {
    [DOCGEN_SECTION]: {
      [PROP_NAME]: {
        required: false,
        ...docgenInfo,
      },
    },
  };

  return component;
}

function extractPropDef(component: Component): PropDef {
  return enhancePropTypesProp(extractPropsFromDocgen(component, DOCGEN_SECTION)[0]);
}

describe('prop type', () => {
  describe('custom', () => {
    describe('when raw value is available', () => {
      it('should support literal', () => {
        const component = createComponent({
          type: {
            name: 'custom',
            raw: 'MY_LITERAL',
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('MY_LITERAL');
        expect(type.detail).toBeUndefined();
      });

      it('should support short object', () => {
        const component = createComponent({
          type: {
            name: 'custom',
            raw: '{\n  text: PropTypes.string.isRequired,\n}',
          },
        });

        const { type } = extractPropDef(component);

        const expectedSummary = `{
          text: string
        }`;

        expect(type.summary.replace(/\s/g, '')).toBe(expectedSummary.replace(/\s/g, ''));
        expect(type.detail).toBeUndefined();
      });

      it('should support long object', () => {
        const component = createComponent({
          type: {
            name: 'custom',
            raw:
              '{\n  text: PropTypes.string.isRequired,\n  value: PropTypes.string.isRequired,\n}',
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('object');

        const expectedDetail = `{
          text: string,
          value: string
        }`;

        expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
      });

      it('should use identifier of a React element when available', () => {
        const component = createComponent({
          type: {
            name: 'custom',
            raw:
              'function InlinedFunctionalComponent() {\n  return <div>Inlined FunctionnalComponent!</div>;\n}',
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('InlinedFunctionalComponent');

        const expectedDetail = `function InlinedFunctionalComponent() {
          return <div>Inlined FunctionnalComponent!</div>;
        }`;

        expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
      });

      it('should not use identifier of a HTML element', () => {
        const component = createComponent({
          type: {
            name: 'custom',
            raw: '<div>Hello world!</div>',
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('element');

        const expectedDetail = '<div>Hello world!</div>';

        expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
      });

      it('should support element without identifier', () => {
        const component = createComponent({
          type: {
            name: 'custom',
            raw: '() => {\n  return <div>Inlined FunctionnalComponent!</div>;\n}',
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('element');

        const expectedDetail = `() => {
            return <div>Inlined FunctionnalComponent!</div>;
          }`;

        expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
      });

      it('should return "custom" when it is not a known type', () => {
        const component = createComponent({
          type: {
            name: 'custom',
            raw: 'Symbol("Hey!")',
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('custom');
      });
    });

    it("should return 'custom' when there is no raw value", () => {
      const component = createComponent({
        type: {
          name: 'custom',
        },
      });

      const { type } = extractPropDef(component);

      expect(type.summary).toBe('custom');
    });

    [
      'any',
      'bool',
      'string',
      'number',
      'symbol',
      'object',
      'element',
      'elementType',
      'node',
    ].forEach(x => {
      it(`should return '${x}' when type is ${x}`, () => {
        const component = createComponent({
          type: {
            name: x,
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe(x);
      });
    });

    it('should support short shape', () => {
      const component = createComponent({
        type: {
          name: 'shape',
          value: {
            foo: {
              name: 'string',
              required: false,
            },
          },
        },
      });

      const { type } = extractPropDef(component);

      const expectedSummary = '{ foo: string }';

      expect(type.summary.replace(/\s/g, '')).toBe(expectedSummary.replace(/\s/g, ''));
      expect(type.detail).toBeUndefined();
    });

    it('should support long shape', () => {
      const component = createComponent({
        type: {
          name: 'shape',
          value: {
            foo: {
              name: 'string',
              required: false,
            },
            bar: {
              name: 'string',
              required: false,
            },
            another: {
              name: 'string',
              required: false,
            },
          },
        },
      });

      const { type } = extractPropDef(component);

      expect(type.summary).toBe('object');

      const expectedDetail = `{
        foo: string,
        bar: string,
        another: string
      }`;

      expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
    });
  });
});
