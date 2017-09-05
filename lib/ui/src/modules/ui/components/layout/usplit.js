import React from 'react';
import PropTypes from 'prop-types';

const gripSize = 1;
const splitSize = 10;

const wrapStyle = {
  vertical: shift => ({
    width: splitSize,
    marginLeft: shift - splitSize / 2,
    marginRight: -shift - splitSize / 2,
    position: 'relative',
  }),
  horizontal: shift => ({
    height: splitSize,
    marginTop: shift - splitSize / 2,
    marginBottom: -shift - splitSize / 2,
    position: 'relative',
  }),
};

const spanStyle = {
  vertical: () => ({
    width: gripSize,
    height: 20,
    left: splitSize / 2 - (gripSize + 2) / 2,
    top: '50%',
    position: 'absolute',
    borderLeft: 'solid 1px rgba(0,0,0,0.1)',
    borderRight: 'solid 1px rgba(0,0,0,0.1)',
  }),
  horizontal: () => ({
    height: gripSize,
    width: 20,
    top: splitSize / 2 - (gripSize + 2) / 2,
    left: '50%',
    position: 'absolute',
    borderTop: 'solid 1px rgba(0,0,0,0.1)',
    borderBottom: 'solid 1px rgba(0,0,0,0.1)',
  }),
};

const USplit = ({ shift, split }) =>
  <div style={wrapStyle[split](shift)}>
    <span style={spanStyle[split]()} />
  </div>;

USplit.propTypes = {
  shift: PropTypes.number,
  split: PropTypes.oneOf(['vertical', 'horizontal']),
};

USplit.defaultProps = {
  shift: 0,
  split: 'vertical',
};

export default USplit;
