import React from 'react';
import { logger } from 'storybook/internal/client-logger';
import { styled } from '@storybook/react-native-theming';
import CheckboxSelect from '../components/CheckboxSelect';
import { ControlTypes } from '../sharedTypes';

export interface CheckProps {
  arg: {
    type: ControlTypes;
    name: string;
    value?: any;
    options?: Array<any> | Record<string, any>;
    control?: {
      labels?: Record<string, string>;
    };
    table?: {
      readonly?: boolean;
    };
  };
  onChange: (value: Array<any>) => void;
}

/** The options as label/value pairs, the on-device equivalent of web's `normalizeOptions`. */
type Options = Map<string, any>;

/**
 * Like web, an options array becomes a label -> value lookup, so options that share a label
 * collapse into one checkbox that stands for the last of them. An options object is already one.
 */
const normalizeOptions = (
  options: NonNullable<CheckProps['arg']['options']>,
  labels: CheckProps['arg']['control']['labels']
): Options => {
  if (!Array.isArray(options)) {
    return new Map(Object.entries(options));
  }

  return options.reduce<Options>((acc, item) => {
    const label =
      labels && !Array.isArray(labels) && typeof labels[item] === 'string'
        ? labels[item]
        : String(item);

    return acc.set(label, item);
  }, new Map());
};

/**
 * The labels of the options whose value is selected, in the order of the options. A missing value
 * means nothing is checked, and a single value (for example an initial arg written as `'bold'`
 * instead of `['bold']`) checks the options with exactly that value.
 */
const selectedLabels = (value: unknown, options: Options): Array<string> => {
  if (value === undefined || value === null) {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];

  return [...options].filter(([, val]) => values.includes(val)).map(([label]) => label);
};

const NoOptions = styled.Text(({ theme }) => ({
  color: theme.color.defaultText,
}));

const Checkboxes = ({ onChange, arg, options }: CheckProps & { options: Options }) => {
  // Like the web check control, keep the selection locally so that toggling several options in a
  // row doesn't depend on each change having come back through the channel first, and resync it
  // whenever the arg changes from outside (a reset, or an update from another client).
  const [selected, setSelected] = React.useState(() => selectedLabels(arg.value, options));
  const [syncedValue, setSyncedValue] = React.useState(arg.value);

  if (arg.value !== syncedValue) {
    setSyncedValue(arg.value);
    setSelected(selectedLabels(arg.value, options));
  }

  // As on web, the values follow the order the options were checked in.
  const onChangeOption = (label: string) => {
    const updated = selected.includes(label)
      ? selected.filter((item) => item !== label)
      : [...selected, label];

    setSelected(updated);
    onChange(updated.map((item) => options.get(item)));
  };

  return (
    <CheckboxSelect
      isInline={arg.type === 'inline-check'}
      labels={[...options.keys()]}
      value={selected}
      onChange={onChangeOption}
      readOnly={!!arg.table?.readonly}
    />
  );
};

const CheckType = ({ onChange, arg }: CheckProps) => {
  const options = React.useMemo(
    () => (arg.options ? normalizeOptions(arg.options, arg.control?.labels) : undefined),
    [arg.options, arg.control?.labels]
  );

  if (!options) {
    logger.warn(`Checkbox with no options: ${arg.name}`);

    return <NoOptions>-</NoOptions>;
  }

  return <Checkboxes onChange={onChange} arg={arg} options={options} />;
};

CheckType.serialize = (value) => value;

CheckType.deserialize = (value) => value;

export default CheckType;
