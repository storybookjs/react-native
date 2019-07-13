import PropTypes from 'prop-types';
import React, { FunctionComponent } from 'react';

import { styled } from '@storybook/theming';

type BooleanTypeKnobValue = boolean;

export interface BooleanTypeKnob {
  name: string;
  value: BooleanTypeKnobValue;
  separator: string;
}

export interface BooleanTypeProps {
  knob: BooleanTypeKnob;
  onChange: (value: BooleanTypeKnobValue) => BooleanTypeKnobValue;
}

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

const serialize = (value: BooleanTypeKnobValue): string | null => (value ? String(value) : null);
const deserialize = (value: string | null) => value === 'true';

const BooleanType: FunctionComponent<BooleanTypeProps> & {
  serialize: typeof serialize;
  deserialize: typeof deserialize;
} = ({ knob, onChange }) => (
  <Input
    id={knob.name}
    name={knob.name}
    type="checkbox"
    onChange={e => onChange(e.target.checked)}
    checked={knob.value}
  />
);

BooleanType.defaultProps = {
  knob: {} as any,
  onChange: value => value,
};

BooleanType.propTypes = {
  // TODO: remove `any` once DefinitelyTyped/DefinitelyTyped#31280 has been resolved
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.bool,
  }) as any,
  onChange: PropTypes.func,
};

BooleanType.serialize = serialize;
BooleanType.deserialize = deserialize;

export default BooleanType;
