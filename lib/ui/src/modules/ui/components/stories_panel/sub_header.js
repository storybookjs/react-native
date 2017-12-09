import PropTypes from 'prop-types';
import React from 'react';
import { baseFonts } from '@storybook/components';

const wrapperStyle = {
  marginTop: 20,
};

const headingStyle = {
  ...baseFonts,
  textTransform: 'uppercase',
  letterSpacing: '1.2px',
  fontSize: '12px',
  fontWeight: 'normal',
  color: '#828282',
  textAlign: 'left',
  padding: '5px 13px',
  margin: 0,
  overflow: 'hidden',
};

const SubHeader = ({ name }) => (
  <div style={wrapperStyle}>
    <h4 style={headingStyle}>{name}</h4>
  </div>
);

SubHeader.defaultProps = {
  name: '',
};

SubHeader.propTypes = {
  name: PropTypes.string,
};

export default SubHeader;
