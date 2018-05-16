import React from 'react';
import PropTypes from 'prop-types';

import { Label, Row, Button } from './styles';

export const RotateViewport = ({ active, ...props }) => (
  <Row>
    <Label htmlFor="rotate">Rotate</Label>
    <Button id="rotate" {...props}>
      {active ? 'Vertical' : 'Landscape'}
    </Button>
  </Row>
);

RotateViewport.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
};

RotateViewport.defaultProps = {
  disabled: true,
  active: false,
};
