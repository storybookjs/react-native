import React from 'react';
import PropTypes from 'prop-types';

import './breakpoints.css';

const Breakpoint = ({ mobile, children }) => {
  const className = mobile ? 'breakpoint-min-width-700' : 'breakpoint-max-width-700';
  return <div className={className}>{children}</div>;
};

Breakpoint.propTypes = {
  children: PropTypes.array, // eslint-disable-line
  mobile: PropTypes.bool,
};
Breakpoint.defaultProps = {
  mobile: false,
};

export { Breakpoint as default };
