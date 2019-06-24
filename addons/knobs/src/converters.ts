const unconvertable = () => undefined;

export const converters = {
  jsonParse: value => JSON.parse(value),
  jsonStringify: value => JSON.stringify(value),
  simple: value => value,
  stringifyIfSet: value => (value === null || value === undefined ? '' : String(value)),
  stringifyIfTruthy: value => (value ? String(value) : null),
  toArray: value => {
    if (Array.isArray(value)) {
      return value;
    }

    return value.split(',');
  },
  toBoolean: value => value === 'true',
  toDate: value => new Date(value).getTime() || new Date().getTime(),
  toFloat: value => (value === '' ? null : parseFloat(value)),
};

export const serializers = {
  array: converters.simple,
  boolean: converters.stringifyIfTruthy,
  button: unconvertable,
  checkbox: converters.simple,
  color: converters.simple,
  date: converters.toDate,
  files: unconvertable,
  number: converters.stringifyIfSet,
  object: converters.jsonStringify,
  options: converters.simple,
  radios: converters.simple,
  select: converters.simple,
  text: converters.simple,
};

export const deserializers = {
  array: converters.toArray,
  boolean: converters.toBoolean,
  button: unconvertable,
  checkbox: converters.simple,
  color: converters.simple,
  date: converters.toDate,
  files: unconvertable,
  number: converters.toFloat,
  object: converters.jsonParse,
  options: converters.simple,
  radios: converters.simple,
  select: converters.simple,
  text: converters.simple,
};
