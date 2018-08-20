import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import Icons from '../icons/util/index';
import { IconButton } from './toolbar';

const Size = styled('div')(({ theme }) => ({
  fontSize: 11,
  lineHeight: '40px',
  marginRight: 5,
  borderRight: theme.mainBorder,
  paddingRight: 10,
}));

const Zoom = ({ current, set }) => (
  <Fragment>
    <Size>
      ({parseFloat(100 / current).toFixed(0)}
      %)
    </Size>
    <IconButton onClick={() => set(0.8)}>
      <Icons.Add />
    </IconButton>
    <IconButton onClick={() => set(1.25)}>
      <Icons.Subtract />
    </IconButton>
  </Fragment>
);
Zoom.propTypes = {
  current: PropTypes.number.isRequired,
  set: PropTypes.func.isRequired,
};

export { Zoom as default };
