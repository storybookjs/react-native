import PropTypes from 'prop-types';
import React from 'react';

import { Form } from '@storybook/components';

const ButtonType = ({ knob, onClick }) => (
  <Form.Button type="button" name={knob.name} onClick={() => onClick(knob)}>
    {knob.name}
  </Form.Button>
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
