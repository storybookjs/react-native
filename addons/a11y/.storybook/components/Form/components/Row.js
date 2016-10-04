import React, { PropTypes } from 'react';

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
  label: PropTypes.instanceOf(Label),
  input: PropTypes.instanceOf(Input),
}

export default Row;
