import React from 'react';
import CheckboxSelect, { type CheckboxOption } from '../components/CheckboxSelect';
import { ControlTypes } from '../sharedTypes';

export interface CheckProps {
  arg: {
    type: ControlTypes;
    name: string;
    value?: any;
    options?: Array<any> | Record<string, any>;
    control?: {
      options?: Array<any> | Record<string, any>;
      labels?: Record<string, string>;
    };
  };
  onChange: (value: Array<any>) => void;
}

const getOptions = (arg: CheckProps['arg']): Array<CheckboxOption> => {
  const options = arg.options ?? arg.control?.options ?? [];
  const labels = arg.control?.labels;

  if (Array.isArray(options)) {
    return options.map((val) => ({
      key: val,
      label:
        labels && !Array.isArray(labels) && typeof labels[val] === 'string'
          ? labels[val]
          : String(val),
    }));
  }

  return Object.keys(options).map((key) => ({ key: options[key], label: key }));
};

/**
 * The checked options' values, in the order of the options. A missing value means nothing is
 * checked, a single value (for example an initial arg written as `'bold'` instead of `['bold']`)
 * checks that option, and values that aren't options are dropped, as on web.
 */
const getSelectedValues = (value: unknown, options: Array<CheckboxOption>): Array<any> => {
  if (value === undefined || value === null) {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];

  return options.filter(({ key }) => values.includes(key)).map(({ key }) => key);
};

const CheckType = ({ onChange, arg }: CheckProps) => {
  const data = React.useMemo(() => getOptions(arg), [arg]);

  // Like the web check control, keep the selection locally so that toggling several options in a
  // row doesn't depend on each change having come back through the channel first, and resync it
  // whenever the arg changes from outside (a reset, or an update from another client).
  const [selected, setSelected] = React.useState(() => getSelectedValues(arg.value, data));
  const [syncedValue, setSyncedValue] = React.useState(arg.value);

  if (arg.value !== syncedValue) {
    setSyncedValue(arg.value);
    setSelected(getSelectedValues(arg.value, data));
  }

  const onChangeOption = (option: CheckboxOption) => {
    // Keep the values in the order of the options, whatever order they were checked in.
    const updated = data
      .filter(({ key }) => (key === option.key) !== selected.includes(key))
      .map(({ key }) => key);

    setSelected(updated);
    onChange(updated);
  };

  return (
    <CheckboxSelect
      isInline={arg.type === 'inline-check'}
      data={data}
      value={selected}
      onChange={onChangeOption}
    />
  );
};

CheckType.serialize = (value) => value;

CheckType.deserialize = (value) => value;

export default CheckType;
