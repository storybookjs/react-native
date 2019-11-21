/* eslint-disable no-underscore-dangle */

import { PropDef } from '@storybook/components';
import { Component } from '../../../blocks/shared';
import { extractComponentProps, DocgenInfo } from '../../../lib/docgen';
import { enhanceTypeScriptProp } from './handleProp';

const DOCGEN_SECTION = 'props';

function createDocgenSection(docgenInfo: DocgenInfo): Record<string, any> {
  return {
    [DOCGEN_SECTION]: {
      ...docgenInfo,
    },
  };
}

function createDocgenProp({
  name,
  tsType,
  ...others
}: Partial<DocgenInfo> & { name: string }): Record<string, any> {
  return {
    [name]: {
      tsType,
      required: false,
      ...others,
    },
  };
}

// eslint-disable-next-line react/forbid-foreign-prop-types
function createComponent({ propTypes = {}, defaultProps = {}, docgenInfo = {} }): Component {
  const component = () => {};
  component.propTypes = propTypes;
  component.defaultProps = defaultProps;

  // @ts-ignore
  component.__docgenInfo = createDocgenSection(docgenInfo);

  return component;
}

function extractPropDef(component: Component): PropDef {
  return enhanceTypeScriptProp(extractComponentProps(component, DOCGEN_SECTION)[0]);
}

describe('enhanceTypeScriptProp', () => {
  describe('defaultValue', () => {
    function createTestComponent(defaultValue: string): Component {
      return createComponent({
        docgenInfo: {
          ...createDocgenProp({
            name: 'prop',
            tsType: { name: 'anything-is-fine' },
            defaultValue: { value: defaultValue },
          }),
        },
      });
    }

    it('should support short object', () => {
      const component = createTestComponent("{ foo: 'foo', bar: 'bar' }");

      const { defaultValue } = extractPropDef(component);

      const expectedSummary = "{ foo: 'foo', bar: 'bar' }";

      expect(defaultValue.summary.replace(/\s/g, '')).toBe(expectedSummary.replace(/\s/g, ''));
      expect(defaultValue.detail).toBeUndefined();
    });

    it('should support long object', () => {
      const component = createTestComponent("{ foo: 'foo', bar: 'bar', another: 'another' }");

      const { defaultValue } = extractPropDef(component);

      expect(defaultValue.summary).toBe('object');

      const expectedDetail = `{
        foo: 'foo',
        bar: 'bar',
        another: 'another'
      }`;

      expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
    });

    it('should support short function', () => {
      const component = createTestComponent('() => {}');

      const { defaultValue } = extractPropDef(component);

      expect(defaultValue.summary).toBe('() => {}');
      expect(defaultValue.detail).toBeUndefined();
    });

    it('should support long function', () => {
      const component = createTestComponent(
        '(foo, bar) => {\n  const concat = foo + bar;\n  const append = concat + " hey!";\n  \n  return append;\n}'
      );

      const { defaultValue } = extractPropDef(component);

      expect(defaultValue.summary).toBe('func');

      const expectedDetail = `(foo, bar) => {
        const concat = foo + bar;
        const append = concat + ' hey!';
        return append
      }`;

      expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
    });

    it('should use the name of function when available and indicate that args are present', () => {
      const component = createTestComponent('function concat(a, b) {\n  return a + b;\n}');

      const { defaultValue } = extractPropDef(component);

      expect(defaultValue.summary).toBe('concat( ... )');

      const expectedDetail = `function concat(a, b) {
        return a + b
      }`;

      expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
    });

    it('should use the name of function when available', () => {
      const component = createTestComponent('function hello() {\n  return "hello";\n}');

      const { defaultValue } = extractPropDef(component);

      expect(defaultValue.summary).toBe('hello()');

      const expectedDetail = `function hello() {
        return 'hello'
      }`;

      expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
    });

    it('should support short element', () => {
      const component = createTestComponent('<div>Hey!</div>');

      const { defaultValue } = extractPropDef(component);

      expect(defaultValue.summary).toBe('<div>Hey!</div>');
      expect(defaultValue.detail).toBeUndefined();
    });

    it('should support long element', () => {
      const component = createTestComponent(
        '() => {\n  return <div>Inlined FunctionnalComponent!</div>;\n}'
      );

      const { defaultValue } = extractPropDef(component);

      expect(defaultValue.summary).toBe('element');

      const expectedDetail = `() => {
        return <div>Inlined FunctionnalComponent!</div>;
      }`;

      expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
    });

    it("should use the name of the React component when it's available", () => {
      const component = createTestComponent(
        'function InlinedFunctionalComponent() {\n  return <div>Inlined FunctionnalComponent!</div>;\n}'
      );

      const { defaultValue } = extractPropDef(component);

      expect(defaultValue.summary).toBe('<InlinedFunctionalComponent />');

      const expectedDetail = `function InlinedFunctionalComponent() {
        return <div>Inlined FunctionnalComponent!</div>;
      }`;

      expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
    });

    it('should not use the name of an HTML element', () => {
      const component = createTestComponent('<div>Hey!</div>');

      const { defaultValue } = extractPropDef(component);

      expect(defaultValue.summary).not.toBe('<div />');
    });

    it('should support short array', () => {
      const component = createTestComponent('[1]');

      const { defaultValue } = extractPropDef(component);

      expect(defaultValue.summary).toBe('[1]');
      expect(defaultValue.detail).toBeUndefined();
    });

    it('should support long array', () => {
      const component = createTestComponent(
        '[\n  {\n    thing: {\n      id: 2,\n      func: () => {},\n      arr: [],\n    },\n  },\n]'
      );

      const { defaultValue } = extractPropDef(component);

      expect(defaultValue.summary).toBe('array');

      const expectedDetail = `[{
          thing: {
            id: 2,
            func: () => {
            },
            arr: []
          }
        }]`;

      expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
    });
  });
});
