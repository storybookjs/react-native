import React, { FunctionComponent, ChangeEvent, Validator } from 'react';
import PropTypes from 'prop-types';

import { Form } from '@storybook/components';
import { KnobControlConfig, KnobControlProps } from './types';

export type SelectTypeKnobValue = string | number | null | undefined | PropertyKey[];

export type SelectTypeOptionsProp<T extends SelectTypeKnobValue = SelectTypeKnobValue> =
  | Record<PropertyKey, T>
  | Record<Extract<T, PropertyKey>, T[keyof T]>
  | Extract<T, PropertyKey>[]
  | readonly Extract<T, PropertyKey>[];

export interface SelectTypeKnob<T extends SelectTypeKnobValue = SelectTypeKnobValue>
  extends KnobControlConfig<T> {
  options: SelectTypeOptionsProp<T>;
}

export interface SelectTypeProps<T extends SelectTypeKnobValue = SelectTypeKnobValue>
  extends KnobControlProps<T> {
  knob: SelectTypeKnob<T>;
}

const serialize = (value: SelectTypeKnobValue) => value;
const deserialize = (value: SelectTypeKnobValue) => value;

const SelectType: FunctionComponent<SelectTypeProps> & {
  serialize: typeof serialize;
  deserialize: typeof deserialize;
} = ({ knob, onChange }) => {
  const { options } = knob;
  const entries = Array.isArray(options)
    ? options.reduce<Record<PropertyKey, SelectTypeKnobValue>>((acc, k) => ({ ...acc, [k]: k }), {})
    : (options as Record<PropertyKey, SelectTypeKnobValue>);

  const selectedKey = Object.keys(entries).find(k => {
    if (Array.isArray(knob.value)) {
      return JSON.stringify(entries[k]) === JSON.stringify(knob.value);
    }
    return entries[k] === knob.value;
  });

  return (
    <Form.Select
      value={selectedKey}
      name={knob.name}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        onChange(entries[e.target.value]);
      }}
      size="flex"
    >
      {Object.entries(entries).map(([key]) => (
        <option key={key} value={key}>
          {key}
        </option>
      ))}
    </Form.Select>
  );
};

SelectType.defaultProps = {
  knob: {} as any,
  onChange: value => value,
};

SelectType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }) as Validator<SelectTypeProps['knob']>,
  onChange: PropTypes.func as Validator<SelectTypeProps['onChange']>,
};

SelectType.serialize = serialize;
SelectType.deserialize = deserialize;

export default SelectType;
