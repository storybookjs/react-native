import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Icons from '../icons/util/index';
import { IconButton } from './toolbar';

const Zoom = ({ set }) => (
  <Fragment>
    <IconButton onClick={e => e.preventDefault() || set(0.8)}>
      <Icons.ZoomIn />
    </IconButton>
    <IconButton onClick={e => e.preventDefault() || set(1.25)}>
      <Icons.ZoomOut />
    </IconButton>
  </Fragment>
);
Zoom.propTypes = {
  set: PropTypes.func.isRequired,
};

export { Zoom as default };
