import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import TypeMap from './types';

const InvalidType = () => <span>Invalid Type</span>;

const Field = styled('div')({
  display: 'table-row',
  padding: '5px',
});
const Label = styled('label')({
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'top',
  paddingRight: 5,
  paddingTop: 5,
  textAlign: 'right',
  width: 80,
  fontSize: 12,
  fontWeight: 600,
});

export default function PropField({ onChange, onClick, knob }) {
  const InputType = TypeMap[knob.type] || InvalidType;
  return (
    <Field>
      <Label htmlFor={knob.name}>{!knob.hideLabel && `${knob.name}`}</Label>
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
