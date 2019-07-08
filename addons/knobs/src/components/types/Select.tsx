import React, { FunctionComponent, ChangeEvent } from 'react';
import PropTypes from 'prop-types';

import { Form } from '@storybook/components';

type SelectTypeKnobValue = string;

export interface SelectTypeKnob {
  name: string;
  value: SelectTypeKnobValue;
  options: SelectTypeOptionsProp;
}

export interface SelectTypeOptionsProp {
  [key: string]: SelectTypeKnobValue;
}

export interface SelectTypeProps {
  knob: SelectTypeKnob;
  onChange: (value: SelectTypeKnobValue) => SelectTypeKnobValue;
}

const serialize = (value: SelectTypeKnobValue) => value;
const deserialize = (value: SelectTypeKnobValue) => value;

const SelectType: FunctionComponent<SelectTypeProps> & {
  serialize: typeof serialize;
  deserialize: typeof deserialize;
} = ({ knob, onChange }) => {
  const { options } = knob;
  const entries = Array.isArray(options)
    ? options.reduce((acc, k) => Object.assign(acc, { [k]: k }), {})
    : options;

  const selectedKey = Object.keys(entries).find(k => entries[k] === knob.value);

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
  // TODO: remove `any` once DefinitelyTyped/DefinitelyTyped#31280 has been resolved
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }) as any,
  onChange: PropTypes.func,
};

SelectType.serialize = serialize;
SelectType.deserialize = deserialize;

export default SelectType;
