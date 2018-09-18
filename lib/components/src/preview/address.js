import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const AddressField = styled.input(({ theme }) => ({
  background: theme.mainFill,
  border: theme.mainBorder,
  borderRadius: theme.mainBorderRadius,
  color: theme.mainTextColor,
  margin: '5px 8px',
  height: 30,
  paddingLeft: 15,
  paddingRight: 15,
  lineHeight: '30px',
  width: '100%',
  overflow: 'auto',
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
}));

const Address = ({ url }) => <AddressField key="address" value={url} readOnly />;
Address.propTypes = {
  url: PropTypes.string.isRequired,
};

export { Address as default };
