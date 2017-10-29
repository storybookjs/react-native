import React from 'react';
import PropTypes from 'prop-types';

/** DocgenButton component description imported from comments inside the component file */
const DocgenButton = ({ disabled, label, onClick }) => (
  <button disabled={disabled} onClick={onClick}>
    {label}
  </button>
);

DocgenButton.defaultProps = {
  disabled: false,
  onClick: () => {},
};

/* eslint-disable react/no-unused-prop-types,react/require-default-props */

const Message = {};

DocgenButton.propTypes = {
  /** Boolean indicating whether the button should render as disabled */
  disabled: PropTypes.bool,
  /** button label. */
  label: PropTypes.string.isRequired,
  /** onClick handler */
  onClick: PropTypes.func,
  /**
   *  A simple `objectOf` propType.
   */
  one: PropTypes.objectOf(PropTypes.number),
  /**
   *  A very complex `objectOf` propType.
   */
  two: PropTypes.objectOf(
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
   * `instanceOf` is also supported and the custom type will be shown instead of `instanceOf`
   */
  msg: PropTypes.instanceOf(Message),
  /**
   * `oneOf` is basically an Enum which is also supported but can be pretty big.
   */
  enm: PropTypes.oneOf(['News', 'Photos']),
  /**
   *  A multi-type prop is also valid and is displayed as `Union<String|Message>`
   */
  union: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Message)]),
};

export default DocgenButton;
