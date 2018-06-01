import PropTypes from 'prop-types';
import React from 'react';

import { Field } from '@storybook/components';
import TypeMap from './types';

const InvalidType = () => <span>Invalid Type</span>;

export default function PropField({ onChange, onClick, knob }) {
  const InputType = TypeMap[knob.type] || InvalidType;
  return (
    <Field label={!knob.hideLabel && `${knob.name}`}>
      <InputType knob={knob} onChange={onChange} onClick={onClick} />
    </Field>
  );
}

PropField.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
