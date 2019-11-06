/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

const NAMED_SHAPE = {
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const ANOTHER_SHAPE = {
  foo: PropTypes.string,
  bar: PropTypes.string,
};

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
  classElement: PropTypes.element,
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
  oneOfComplexType: PropTypes.oneOf([NAMED_SHAPE, ANOTHER_SHAPE]),
  oneOfComponents: PropTypes.oneOf([FunctionalComponent, ClassComponent]),
  oneOfEval: PropTypes.oneOf((() => ['News', 'Photos'])()),
  oneOfVar: PropTypes.oneOf(POSITIONS),
  oneOfNested: PropTypes.oneOf([
    'News',
    [POSITIONS, ['bottom-left', 'botton-center', 'bottom-right']],
  ]),
  /**
   *  A multi-type prop is also valid and is displayed as `Union<String|Message>`
   */
  oneOfType: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Set)]),
  /**
   * array of a primitive type
   */
  arrayOfPrimitive: PropTypes.arrayOf(PropTypes.number),
  arrayOfNamedShape: PropTypes.arrayOf(NAMED_SHAPE),
  arrayOfInlineShape: PropTypes.arrayOf({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
  arrayOfComplexInlineShape: PropTypes.arrayOf({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    shape: {
      id: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
    },
  }),
  /**
   *  A simple `objectOf` propType.
   */
  simpleObjectOf: PropTypes.objectOf(PropTypes.number),
  /**
   *  A very complex `objectOf` propType.
   */
  complexObjectOf: PropTypes.objectOf(
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
  namedObjectOf: PropTypes.objectOf(NAMED_SHAPE),
  /**
   * propType for shape with nested arrayOf
   *
   * Also, multi-line description
   */
  shape: PropTypes.shape({
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
      }),
    }),
  }),
  namedShape: PropTypes.shape(NAMED_SHAPE),
  exact: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number,
  }),
  namedExact: PropTypes.exact(NAMED_SHAPE),
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
  classElement: <ClassComponent />,
  functionalElementType: FunctionalComponent,
  classElementType: ClassComponent,
  instanceOf: new Set(),
  oneOfString: 'News',
  oneOfNumeric: 1,
  oneOfComplexType: { text: 'foo', value: 'bar' },
  oneOfComponents: <FunctionalComponent />,
  oneOfEval: 'Photos',
  oneOfVar: 'top-right',
  oneOfNested: 'top-right',
  oneOfType: 'hello',
  arrayOfPrimitive: [1, 2, 3],
  arrayOfNamedShape: [{ text: 'foo', value: 'bar' }],
  arrayOfInlineShape: [{ text: 'foo', value: 'bar' }],
  arrayOfComplexInlineShape: [{ text: 'foo', value: 'bar' }],
  simpleObjectOf: { key: 1 },
  complexObjectOf: {
    thing: {
      id: 2,
      func: () => {},
      arr: [],
    },
  },
  shape: {
    id: 3,
    func: () => {},
    arr: [],
    shape: {
      shape: {
        foo: 'bar',
      },
    },
  },
  namedObjectOf: { text: 'foo', value: 'bar' },
  namedShape: { text: 'foo', value: 'bar' },
  exact: { name: 'foo', quantity: 2 },
  namedExact: { text: 'foo', value: 'bar' },
  optionalString: 'Default String',
  nullDefaultValue: null,
  undefinedDefaultValue: undefined,
};
