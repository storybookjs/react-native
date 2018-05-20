import PropTypes from 'prop-types';
import React from 'react';

import styled from 'react-emotion';

const Button = styled('button')({
  height: '26px',
});

const ButtonType = ({ knob, onClick }) => (
  <Button type="button" id={knob.name} onClick={() => onClick(knob)}>
    {knob.name}
  </Button>
);

ButtonType.defaultProps = {
  knob: {},
};

ButtonType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
  }),
  onClick: PropTypes.func.isRequired,
};

ButtonType.serialize = () => undefined;
ButtonType.deserialize = () => undefined;

export default ButtonType;
