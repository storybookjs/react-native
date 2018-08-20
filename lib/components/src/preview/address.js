import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { window } from 'global';

import { IconButton } from './toolbar';
import Icons from '../icons/util/index';

const AddressField = styled('input')(({ theme }) => ({
  background: theme.mainFill,
  border: theme.mainBorder,
  borderRadius: theme.mainBorderRadius,
  color: theme.mainTextColor,
  margin: 5,
  height: 30,
  paddingLeft: 15,
  paddingRight: 15,
  lineHeight: '30px',
  width: '100%',
  overflow: 'auto',
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
}));

const Address = ({ url }) => (
  <Fragment>
    <AddressField value={url} readOnly />
    <IconButton onClick={() => window.open(url)}>
      <Icons.NewWindow />
    </IconButton>
  </Fragment>
);
Address.propTypes = {
  url: PropTypes.string.isRequired,
};

export { Address as default };
