/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

const ITEM_SHAPE = {
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export const PropTypesProps = () => <div>PropTypes!</div>;

PropTypesProps.propTypes = {
  arrayOfPrimitive: PropTypes.arrayOf(PropTypes.string),
  arrayOfShape: PropTypes.arrayOf(ITEM_SHAPE),
};

PropTypesProps.defaultProps = {
  arrayOfPrimitive: ['foo', 'bar'],
  arrayOfShape: [{ text: 'foo', value: 'bar' }],
};
