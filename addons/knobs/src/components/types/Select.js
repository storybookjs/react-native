import React from 'react';
import PropTypes from 'prop-types';

import { Form } from '@storybook/components';

const SelectType = ({ knob, onChange }) => {
  const { options } = knob;
  const entries = Array.isArray(options)
    ? options.reduce((acc, k) => Object.assign(acc, { [k]: k }), {})
    : options;

  const selectedKey = Object.keys(entries).find(k => entries[k] === knob.value);

  return (
    <Form.Select
      value={selectedKey}
      name={knob.name}
      onChange={e => {
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
  knob: {},
  onChange: value => value,
};

SelectType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }),
  onChange: PropTypes.func,
};

SelectType.serialize = value => value;
SelectType.deserialize = value => value;

export default SelectType;
