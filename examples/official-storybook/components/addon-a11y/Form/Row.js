import React from 'react';
import PropTypes from 'prop-types';

import Label from './Label';
import Input from './Input';

function Row({ label, input }) {
  return (
    <div>
      {label}
      {input}
    </div>
  );
}

Row.propTypes = {
  label: PropTypes.shape({ type: PropTypes.oneOf([Label]) }),
  input: PropTypes.shape({ type: PropTypes.oneOf([Input]) }).isRequired,
};

Row.defaultProps = {
  label: null,
};

export default Row;
