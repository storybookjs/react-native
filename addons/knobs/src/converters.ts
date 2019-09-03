const unconvertable = (): undefined => undefined;

export const converters = {
  jsonParse: (value: any): any => JSON.parse(value),
  jsonStringify: (value: any): string => JSON.stringify(value),
  simple: (value: any): any => value,
  stringifyIfSet: (value: any): string =>
    value === null || value === undefined ? '' : String(value),
  stringifyIfTruthy: (value: any): string | null => (value ? String(value) : null),
  toArray: (value: any): any[] => {
    if (Array.isArray(value)) {
      return value;
    }

    return value.split(',');
  },
  toBoolean: (value: any): boolean => value === 'true',
  toDate: (value: any): number => new Date(value).getTime() || new Date().getTime(),
  toFloat: (value: any): number | null => (value === '' ? null : parseFloat(value)),
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
