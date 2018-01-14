import PropTypes from 'prop-types';
import React from 'react';
import { baseFonts } from '@storybook/components';

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
  marginTop: 20,
  overflow: 'hidden',
};

const TreeHeader = ({ children }) => <h4 style={headingStyle}>{children}</h4>;

TreeHeader.propTypes = {
  children: PropTypes.string.isRequired,
};

export default TreeHeader;
