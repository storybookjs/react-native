import PropTypes from 'prop-types';

import glamorous from 'glamorous';

import { baseFonts } from '@storybook/components';

const TreeHeader = glamorous.h4(baseFonts, {
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
});

TreeHeader.propTypes = {
  children: PropTypes.string.isRequired,
};

export default TreeHeader;
