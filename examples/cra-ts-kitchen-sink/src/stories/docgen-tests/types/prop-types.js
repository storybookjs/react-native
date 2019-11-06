/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes, { string } from 'prop-types';

const ITEM_SHAPE = {
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export const PropTypesProps = () => <div>PropTypes!</div>;

PropTypesProps.propTypes = {
  arrayOfPrimitive: PropTypes.arrayOf(PropTypes.string),
  arrayOfShape: PropTypes.arrayOf(ITEM_SHAPE),
  arrayOfInlineShape: PropTypes.arrayOf({
    text: string.isRequired,
    value: string.isRequired,
  }).isRequired,
};

PropTypesProps.defaultProps = {
  arrayOfPrimitive: ['foo', 'bar'],
  arrayOfShape: [{ text: 'foo', value: 'bar' }],
};
