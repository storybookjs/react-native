/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes, { string, shape } from 'prop-types';

const NAMED_OBJECT = {
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const ANOTHER_OBJECT = {
  foo: PropTypes.string,
  bar: PropTypes.string,
};

const NAMED_SHAPE = PropTypes.shape({
  foo: PropTypes.string,
});

export const POSITIONS = ['top-left', 'top-right', 'top-center'];

const FunctionalComponent = () => {
  return <div>FunctionnalComponent!</div>;
};

class ClassComponent extends React.PureComponent {
  render() {
    return <div>ClassComponent!</div>;
  }
}

function concat(a, b) {
  return a + b;
}

export const PropTypesProps = () => <div>PropTypes!</div>;

PropTypesProps.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  any: PropTypes.any,
  bool: PropTypes.bool,
  string: PropTypes.string,
  func: PropTypes.func,
  /**
   * A function with JSDoc tags.
   *
   * @param {string} foo - A foo value.
   * @param {number} bar - A bar value.
   * @returns {ComplexObject} - Returns a complex object.
   */
  funcWithJsDoc: PropTypes.func,
  namedDefaultFunc: PropTypes.func,
  number: PropTypes.number,
  /**
   * Plain object propType (use shape!!)
   */
  obj: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  symbol: PropTypes.symbol,
  node: PropTypes.node,
  functionalElement: PropTypes.element,
  functionalElementInline: PropTypes.element,
  functionalElementNamedInline: PropTypes.element,
  classElement: PropTypes.element,
  classElementInline: PropTypes.element,
  functionalElementType: PropTypes.elementType,
  classElementType: PropTypes.elementType,
  /**
   * `instanceOf` is also supported and the custom type will be shown instead of `instanceOf`
   */
  instanceOf: PropTypes.instanceOf(Set),
  /**
   * `oneOf` is basically an Enum which is also supported but can be pretty big.
   */
  oneOfString: PropTypes.oneOf(['News', 'Photos']),
  oneOfNumeric: PropTypes.oneOf([0, 1, 2, 3]),
  oneOfShapes: PropTypes.oneOf([
    PropTypes.shape({ foo: PropTypes.string }),
    PropTypes.shape({ bar: PropTypes.number }),
  ]),
  oneOfComplexShapes: PropTypes.oneOf([
    PropTypes.shape({
      /**
       *  Just an internal propType for a shape.
       *  It's also required, and as you can see it supports multi-line comments!
       */
      id: PropTypes.number.isRequired,
      /**
       *  A simple non-required function
       */
      func: PropTypes.func,
      /**
       * An `arrayOf` shape
       */
      arr: PropTypes.arrayOf(
        PropTypes.shape({
          /**
           * 5-level deep propType definition and still works.
           */
          index: PropTypes.number.isRequired,
        })
      ),
    }),
    shape({ bar: PropTypes.number }),
  ]),
  oneOfComplexType: PropTypes.oneOf([NAMED_OBJECT, ANOTHER_OBJECT]),
  oneOfComponents: PropTypes.oneOf([FunctionalComponent, ClassComponent]),
  oneOfEval: PropTypes.oneOf((() => ['News', 'Photos'])()),
  oneOfVar: PropTypes.oneOf(POSITIONS),
  oneOfNested: PropTypes.oneOf(['News', ['bottom-left', 'botton-center', 'bottom-right']]),
  /**
   *  A multi-type prop is also valid and is displayed as `Union<String|Message>`
   */
  oneOfType: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Set)]),
  /**
   * array of a primitive type
   */
  arrayOfPrimitive: PropTypes.arrayOf(PropTypes.number),
  arrayOfNamedObject: PropTypes.arrayOf(NAMED_OBJECT),
  arrayOfShortInlineObject: PropTypes.arrayOf({
    foo: PropTypes.string,
  }),
  arrayOfInlineObject: PropTypes.arrayOf({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
  arrayOfComplexInlineObject: PropTypes.arrayOf({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    shape: {
      id: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
    },
  }),
  arrayOfShortShape: PropTypes.arrayOf(
    PropTypes.shape({
      bar: PropTypes.string,
    })
  ),
  arrayOfComplexShape: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       *  Just an internal propType for a shape.
       *  It's also required, and as you can see it supports multi-line comments!
       */
      id: PropTypes.number.isRequired,
      /**
       *  A simple non-required function
       */
      func: PropTypes.func,
      /**
       * An `arrayOf` shape
       */
      arr: PropTypes.arrayOf(
        PropTypes.shape({
          /**
           * 5-level deep propType definition and still works.
           */
          index: PropTypes.number.isRequired,
        })
      ),
    })
  ),
  /**
   *  A simple `objectOf` propType.
   */
  simpleObjectOf: PropTypes.objectOf(PropTypes.number),
  objectOfShortInlineObject: PropTypes.objectOf({
    foo: PropTypes.string,
  }),
  objectOfInlineObject: PropTypes.objectOf({
    foo: PropTypes.string,
    bar: PropTypes.string,
    barry: PropTypes.string,
  }),
  objectOfShortShape: PropTypes.objectOf(
    PropTypes.shape({
      foo: string,
    })
  ),
  /**
   *  A very complex `objectOf` propType.
   */
  objectOfComplexShape: PropTypes.objectOf(
    PropTypes.shape({
      /**
       *  Just an internal propType for a shape.
       *  It's also required, and as you can see it supports multi-line comments!
       */
      id: PropTypes.number.isRequired,
      /**
       *  A simple non-required function
       */
      func: PropTypes.func,
      /**
       * An `arrayOf` shape
       */
      arr: PropTypes.arrayOf(
        PropTypes.shape({
          /**
           * 5-level deep propType definition and still works.
           */
          index: PropTypes.number.isRequired,
        })
      ),
    })
  ),
  namedObjectOf: PropTypes.objectOf(NAMED_OBJECT),
  shapeShort: PropTypes.shape({
    foo: string,
  }),
  /**
   * propType for shape with nested arrayOf
   *
   * Also, multi-line description
   */
  shapeComplex: PropTypes.shape({
    /**
     *  Just an internal propType for a shape.
     *  It's also required, and as you can see it supports multi-line comments!
     */
    id: PropTypes.number.isRequired,
    /**
     *  A simple non-required function
     */
    func: PropTypes.func,
    /**
     * An `arrayOf` shape
     */
    arr: PropTypes.arrayOf(
      PropTypes.shape({
        /**
         * 5-level deep propType definition and still works.
         */
        index: PropTypes.number.isRequired,
      })
    ),
    shape: PropTypes.shape({
      shape: PropTypes.shape({
        foo: PropTypes.string,
        oneOf: PropTypes.oneOf(['one', 'two']),
      }),
    }),
    oneOf: PropTypes.oneOf(['one', 'two']),
  }),
  namedShape: NAMED_SHAPE,
  namedObjectInShape: PropTypes.shape(NAMED_OBJECT),
  exact: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number,
  }),
  namedExact: PropTypes.exact(NAMED_OBJECT),
  /**
   * test string with a comment that has
   * two identical lines
   * two identical lines
   */
  optionalString: PropTypes.string,
  requiredString: PropTypes.string.isRequired,
  nullDefaultValue: PropTypes.string,
  undefinedDefaultValue: PropTypes.string,
};

PropTypesProps.defaultProps = {
  any: 'Default any',
  bool: false,
  string: 'Default string',
  func: () => {},
  funcWithJsDoc: (foo, bar) => {
    // eslint-disable-next-line
    const yo = window.document;
    // eslint-disable-next-line
    const pouf = souffle;

    return { foo, bar };
  },
  namedDefaultFunc: concat,
  number: 5,
  obj: {
    key: 'value',
  },
  symbol: Symbol('Default symbol'),
  node: <div>Hello!</div>,
  functionalElement: <FunctionalComponent />,
  functionalElementInline: () => {
    return <div>Inlined FunctionnalComponent!</div>;
  },
  functionalElementNamedInline: function InlinedFunctionalComponent() {
    return <div>Inlined FunctionnalComponent!</div>;
  },
  classElement: <ClassComponent />,
  classElementInline: class InlinedClassComponent extends React.PureComponent {
    render() {
      return <div>Inlined ClassComponent!</div>;
    }
  },
  functionalElementType: FunctionalComponent,
  classElementType: ClassComponent,
  instanceOf: new Set(),
  oneOfString: 'News',
  oneOfNumeric: 1,
  oneOfShapes: { foo: 'bar' },
  oneOfComplexShapes: {
    thing: {
      id: 2,
      func: () => {},
      arr: [],
    },
  },
  oneOfComplexType: { text: 'foo', value: 'bar' },
  oneOfComponents: <FunctionalComponent />,
  oneOfEval: 'Photos',
  oneOfVar: 'top-right',
  oneOfNested: 'top-right',
  oneOfType: 'hello',
  arrayOfPrimitive: [1, 2, 3],
  arrayOfNamedObject: [{ text: 'foo', value: 'bar' }],
  arrayOfShortInlineObject: [{ foo: 'bar' }],
  arrayOfInlineObject: [{ text: 'foo', value: 'bar' }],
  arrayOfComplexInlineObject: [{ text: 'foo', value: 'bar' }],
  arrayOfShortShape: [{ bar: 'foo' }],
  arrayOfComplexShape: [
    {
      thing: {
        id: 2,
        func: () => {},
        arr: [],
      },
    },
  ],
  simpleObjectOf: { key: 1 },
  objectOfShortInlineObject: { foo: 'bar' },
  objectOfInlineObject: { foo: 'bar', bar: 'foo' },
  objectOfShortShape: { foo: 'bar' },
  objectOfComplexShape: {
    thing: {
      id: 2,
      func: () => {},
      arr: [],
    },
  },
  namedObjectOf: { text: 'foo', value: 'bar' },
  shapeShort: { foo: 'bar' },
  shapeComplex: {
    id: 3,
    func: () => {},
    arr: [],
    shape: {
      shape: {
        foo: 'bar',
      },
    },
  },
  namedShape: { foo: 'bar' },
  namedObjectInShape: { text: 'foo', value: 'bar' },
  exact: { name: 'foo', quantity: 2 },
  namedExact: { text: 'foo', value: 'bar' },
  optionalString: 'Default String',
  nullDefaultValue: null,
  undefinedDefaultValue: undefined,
};
