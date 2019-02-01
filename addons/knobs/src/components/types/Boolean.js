import PropTypes from 'prop-types';
import React from 'react';

import { styled } from '@storybook/theming';

const Input = styled.input({
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'top',
  height: 21,
  outline: 'none',
  border: '1px solid #ececec',
  fontSize: '12px',
  color: '#555',
});

const BooleanType = ({ knob, onChange }) => (
  <Input
    id={knob.name}
    name={knob.name}
    type="checkbox"
    onChange={e => onChange(e.target.checked)}
    checked={knob.value}
  />
);

BooleanType.defaultProps = {
  knob: {},
  onChange: value => value,
};

BooleanType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.bool,
  }),
  onChange: PropTypes.func,
};

BooleanType.serialize = value => (value ? String(value) : null);
BooleanType.deserialize = value => value === 'true';

export default BooleanType;
