import PropTypes from 'prop-types';

import styled from 'react-emotion';

import { baseFonts } from '@storybook/components';

const TreeHeader = styled('h4')(baseFonts, {
  textTransform: 'uppercase',
  letterSpacing: '1.2px',
  fontSize: '12px',
  fontWeight: 'normal',
  color: '#828282',
  textAlign: 'left',
  padding: '0 13px 5px 13px',
  margin: 0,
  overflow: 'hidden',
});

TreeHeader.propTypes = {
  children: PropTypes.string.isRequired,
};

export default TreeHeader;
