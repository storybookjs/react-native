/* eslint-disable no-underscore-dangle */

import { PropDef } from '@storybook/components';
import PropTypes from 'prop-types';
import { Component } from '../../../blocks/shared';
import { extractPropsFromDocgen, DocgenInfo } from '../../../lib/docgen';
import { enhancePropTypesProp, enhancePropTypesProps } from './handleProp';

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
  type,
  ...others
}: Partial<DocgenInfo> & { name: string }): Record<string, any> {
  return {
    [name]: {
      type,
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
  return enhancePropTypesProp(extractPropsFromDocgen(component, DOCGEN_SECTION)[0]);
}

describe('enhancePropTypesProp', () => {
  function createTestComponent(docgenInfo: Partial<DocgenInfo>): Component {
    return createComponent({
      docgenInfo: {
        ...createDocgenProp({ name: 'prop', ...docgenInfo }),
      },
    });
  }

  describe('type', () => {
    describe('custom', () => {
      describe('when raw value is available', () => {
        it('should support literal', () => {
          const component = createTestComponent({
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
          const component = createTestComponent({
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
          const component = createTestComponent({
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
          const component = createTestComponent({
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
          const component = createTestComponent({
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
          const component = createTestComponent({
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
          const component = createTestComponent({
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
        const component = createTestComponent({
          type: {
            name: 'custom',
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('custom');
      });
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
        const component = createTestComponent({
          type: {
            name: x,
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe(x);
      });
    });

    it('should support short shape', () => {
      const component = createTestComponent({
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
      const component = createTestComponent({
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

    it('should support enum of string', () => {
      const component = createTestComponent({
        type: {
          name: 'enum',
          value: [
            {
              value: "'News'",
              computed: false,
            },
            {
              value: "'Photos'",
              computed: false,
            },
          ],
        },
      });

      const { type } = extractPropDef(component);

      expect(type.summary).toBe("'News' | 'Photos'");
    });

    it('should support enum of object', () => {
      const component = createTestComponent({
        type: {
          name: 'enum',
          value: [
            {
              value:
                '{\n  text: PropTypes.string.isRequired,\n  value: PropTypes.string.isRequired,\n}',
              computed: true,
            },
            {
              value: '{\n  foo: PropTypes.string,\n  bar: PropTypes.string,\n}',
              computed: true,
            },
          ],
        },
      });

      const { type } = extractPropDef(component);

      expect(type.summary).toBe('object | object');

      const expectedDetail = `{
          text: string,
          value: string
        } | {
          foo: string,
          bar: string
        }`;

      expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
    });

    it('should support enum of element', () => {
      const component = createTestComponent({
        type: {
          name: 'enum',
          value: [
            {
              value: '() => {\n  return <div>FunctionnalComponent!</div>;\n}',
              computed: true,
            },
            {
              value:
                'class ClassComponent extends React.PureComponent {\n  render() {\n    return <div>ClassComponent!</div>;\n  }\n}',
              computed: true,
            },
          ],
        },
      });

      const { type } = extractPropDef(component);

      expect(type.summary).toBe('element | ClassComponent');

      const expectedDetail = `() => {
          return <div>FunctionnalComponent!</div>;
        } | class ClassComponent extends React.PureComponent {
          render() {
            return <div>ClassComponent!</div>;
          }
        }`;

      expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
    });

    describe('func', () => {
      it('should return "func" when the prop dont have a description', () => {
        const component = createTestComponent({
          type: {
            name: 'func',
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('func');
      });

      it('should return "func" when the prop have a description without JSDoc tags', () => {
        const component = createTestComponent({
          type: {
            name: 'func',
          },
          description: 'Hey! Hey!',
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('func');
      });

      it('should return a func signature when there is JSDoc tags.', () => {
        const component = createTestComponent({
          type: {
            name: 'func',
          },
          description: '@param event\n@param data\n@returns {string}',
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('(event, data) => string');
      });
    });

    it('should return the instance type when type is instanceOf', () => {
      const component = createTestComponent({
        type: {
          name: 'instanceOf',
          value: 'Set',
        },
      });

      const { type } = extractPropDef(component);

      expect(type.summary).toBe('Set');
    });

    describe('objectOf', () => {
      it('should support objectOf primitive', () => {
        const component = createTestComponent({
          type: {
            name: 'objectOf',
            value: {
              name: 'number',
            },
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('objectOf(number)');
        expect(type.detail).toBeUndefined();
      });

      it('should support objectOf of identifier', () => {
        const component = createTestComponent({
          type: {
            name: 'objectOf',
            value: {
              name: 'custom',
              raw: 'NAMED_OBJECT',
            },
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('objectOf(NAMED_OBJECT)');
        expect(type.detail).toBeUndefined();
      });

      it('should support objectOf short object', () => {
        const component = createTestComponent({
          type: {
            name: 'objectOf',
            value: {
              name: 'custom',
              raw: '{\n  foo: PropTypes.string,\n}',
            },
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('objectOf({ foo: string })');
        expect(type.detail).toBeUndefined();
      });

      it('should support objectOf long object', () => {
        const component = createTestComponent({
          type: {
            name: 'objectOf',
            value: {
              name: 'custom',
              raw:
                '{\n  foo: PropTypes.string,\n  bar: PropTypes.string,\n  another: PropTypes.string,\n}',
            },
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('objectOf(object)');

        const expectedDetail = `objectOf({
          foo: string,
          bar: string,
          another: string
        })`;

        expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
      });

      it('should support objectOf short shape', () => {
        const component = createTestComponent({
          type: {
            name: 'objectOf',
            value: {
              name: 'shape',
              value: {
                foo: {
                  name: 'string',
                  required: false,
                },
              },
            },
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('objectOf({ foo: string })');
        expect(type.detail).toBeUndefined();
      });

      it('should support objectOf long shape', () => {
        const component = createTestComponent({
          type: {
            name: 'objectOf',
            value: {
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
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('objectOf(object)');

        const expectedDetail = `objectOf({
          foo: string,
          bar: string,
          another: string
        })`;

        expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
      });
    });

    it('should support union', () => {
      const component = createTestComponent({
        type: {
          name: 'union',
          value: [
            {
              name: 'string',
            },
            {
              name: 'instanceOf',
              value: 'Set',
            },
          ],
        },
      });

      const { type } = extractPropDef(component);

      expect(type.summary).toBe('string | Set');
      expect(type.detail).toBeUndefined();
    });

    describe('array', () => {
      it('should support array of primitive', () => {
        const component = createTestComponent({
          type: {
            name: 'arrayOf',
            value: {
              name: 'number',
            },
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('number[]');
        expect(type.detail).toBeUndefined();
      });

      it('should support array of identifier', () => {
        const component = createTestComponent({
          type: {
            name: 'arrayOf',
            value: {
              name: 'custom',
              raw: 'NAMED_OBJECT',
            },
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('NAMED_OBJECT[]');
        expect(type.detail).toBeUndefined();
      });

      it('should support array of short object', () => {
        const component = createTestComponent({
          type: {
            name: 'arrayOf',
            value: {
              name: 'custom',
              raw: '{\n  foo: PropTypes.string,\n}',
            },
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('[{ foo: string }]');
        expect(type.detail).toBeUndefined();
      });

      it('should support array of long object', () => {
        const component = createTestComponent({
          type: {
            name: 'arrayOf',
            value: {
              name: 'custom',
              raw:
                '{\n  text: PropTypes.string.isRequired,\n  value: PropTypes.string.isRequired,\n}',
            },
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('object[]');

        const expectedDetail = `[{
          text: string,
          value: string
        }]`;

        expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
      });

      it('should support array of short shape', () => {
        const component = createTestComponent({
          type: {
            name: 'arrayOf',
            value: {
              name: 'shape',
              value: {
                foo: {
                  name: 'string',
                  required: false,
                },
              },
            },
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('[{ foo: string }]');
        expect(type.detail).toBeUndefined();
      });

      it('should support array of long shape', () => {
        const component = createTestComponent({
          type: {
            name: 'arrayOf',
            value: {
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
          },
        });

        const { type } = extractPropDef(component);

        expect(type.summary).toBe('object[]');

        const expectedDetail = `[{
          foo: string,
          bar: string,
          another: string
        }]`;

        expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
      });
    });
  });
});

describe('enhancePropTypesProps', () => {
  it('keep the original definition order', () => {
    const component = createComponent({
      propTypes: {
        foo: PropTypes.string,
        middleWithDefaultValue: PropTypes.string,
        bar: PropTypes.string,
        endWithDefaultValue: PropTypes.string,
      },
      docgenInfo: {
        ...createDocgenProp({
          name: 'middleWithDefaultValue',
          type: { name: 'string' },
          defaultValue: { value: 'Middle!' },
        }),
        ...createDocgenProp({
          name: 'endWithDefaultValue',
          type: { name: 'string' },
          defaultValue: { value: 'End!' },
        }),
        ...createDocgenProp({
          name: 'foo',
          type: { name: 'string' },
        }),
        ...createDocgenProp({
          name: 'bar',
          type: { name: 'string' },
        }),
      },
    });

    const props = enhancePropTypesProps(
      extractPropsFromDocgen(component, DOCGEN_SECTION),
      component
    );

    expect(props.length).toBe(4);
    expect(props[0].name).toBe('foo');
    expect(props[1].name).toBe('middleWithDefaultValue');
    expect(props[2].name).toBe('bar');
    expect(props[3].name).toBe('endWithDefaultValue');
  });
});
