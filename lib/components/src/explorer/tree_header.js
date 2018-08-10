import PropTypes from 'prop-types';

import styled from 'react-emotion';

const TreeHeader = styled('h4')(({ theme }) => ({
  textTransform: 'uppercase',
  letterSpacing: '1.2px',
  fontSize: '12px',
  fontWeight: 'normal',
  color: theme.dimmedTextColor,
  textAlign: 'left',
  padding: '0 13px 5px 13px',
  margin: 0,
  overflow: 'hidden',
}));

TreeHeader.propTypes = {
  children: PropTypes.string.isRequired,
};

export default TreeHeader;
