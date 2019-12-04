/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';

export const PropsSort = () => <div>PropsSort!</div>;
PropsSort.propTypes = {
  foo: PropTypes.string,
  middleWithDefaultValue: PropTypes.string,
  bar: PropTypes.string,
  endWithDefaultValue: PropTypes.string,
};
PropsSort.defaultProps = {
  middleWithDefaultValue: 'Middle!',
  endWithDefaultValue: 'End!',
};
