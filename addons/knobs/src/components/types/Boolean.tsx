import PropTypes from 'prop-types';
import React, { FunctionComponent, Validator } from 'react';

import { styled } from '@storybook/theming';
import { KnobControlConfig, KnobControlProps } from './types';

type BooleanTypeKnobValue = boolean;

export type BooleanTypeKnob = KnobControlConfig<BooleanTypeKnobValue>;

export interface BooleanTypeProps extends KnobControlProps<BooleanTypeKnobValue> {
  knob: BooleanTypeKnob;
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
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.bool,
  }) as Validator<BooleanTypeProps['knob']>,
  onChange: PropTypes.func as Validator<BooleanTypeProps['onChange']>,
};

BooleanType.serialize = serialize;
BooleanType.deserialize = deserialize;

export default BooleanType;
