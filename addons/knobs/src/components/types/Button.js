import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@storybook/components';

const ButtonType = ({ knob, onClick }) => (
  <Button type="button" onClick={() => onClick(knob)}>
    {knob.name}
  </Button>
);

ButtonType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

ButtonType.serialize = () => undefined;
ButtonType.deserialize = () => undefined;

export default ButtonType;
