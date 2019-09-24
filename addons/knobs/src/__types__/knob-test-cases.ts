import {
  number,
  color,
  files,
  object,
  boolean,
  text,
  select,
  date,
  array,
  button,
  knob,
  radios,
  optionsKnob as options,
} from '../index';

// Note: this is a helper to batch test return types and avoid "declared but never read" errors
function expectKnobOfType<T>(..._: T[]) {}

const groupId = 'GROUP-ID1';

/** Text knob */

expectKnobOfType<string>(
  text('text simple', 'Batman'),
  text('text with group', 'default', groupId)
);

/** Date knob */

expectKnobOfType<number>(
  date('date simple', new Date('January 20 1887')),
  date('date with group', new Date(), groupId)
);

/** Boolean knob */

expectKnobOfType<boolean>(
  boolean('boolean simple', false),
  boolean('boolean with group', true, groupId)
);

/** Color knob */

expectKnobOfType<string>(
  color('color simple', 'black'),
  color('color with group', '#ffffff', groupId)
);

/** Number knob */

expectKnobOfType<number>(
  number('number basic', 42),
  number('number with options', 72, { range: true, min: 60, max: 90, step: 1 }),
  number('number with group', 1, {}, groupId)
);

/** Radios knob */

expectKnobOfType<string>(
  radios(
    'radio with string values',
    {
      1100: '1100',
      2200: '2200',
      3300: '3300',
    },
    '2200'
  )
);

expectKnobOfType<number>(radios('radio with number values', { 3: 3, 7: 7, 23: 23 }, 3));

expectKnobOfType<string | number | null>(
  radios(
    'radio with mixed value',
    {
      1100: '1100',
      2200: 2200,
      3300: '3300',
    },
    null,
    groupId
  )
);

/** Select knob */

enum SomeEnum {
  Type1 = 1,
  Type2,
}
enum ButtonVariant {
  primary = 'primary',
  secondary = 'secondary',
}
const stringLiteralArray: ('Apple' | 'Banana' | 'Grapes')[] = ['Apple', 'Banana', 'Grapes'];

expectKnobOfType<string>(
  select(
    'select with string options',
    {
      None: 'none',
      Underline: 'underline',
      'Line-through': 'line-through',
    },
    'none'
  ),
  select<string>('select with string array', ['yes', 'no'], 'yes'),
  select('select with string literal array', stringLiteralArray, stringLiteralArray[0]),
  select('select with readonly array', ['red', 'blue'] as const, 'red'),
  select<ButtonVariant>('select with string enum options', ButtonVariant, ButtonVariant.primary)
);

expectKnobOfType<string | null>(
  select('select with null option', { a: 'Option', b: null }, null, groupId)
);

expectKnobOfType<number>(
  select('select with number options', { 'type a': 1, 'type b': 2 }, 1),
  select<SomeEnum>(
    'select with numeric enum options',
    { 'type a': SomeEnum.Type1, 'type b': SomeEnum.Type2 },
    SomeEnum.Type2
  ),
  select<number>('select with number array', [1, 2, 3, 4], 1),
  select('select with readonly number array', [1, 2] as const, 1)
);

expectKnobOfType<number | null>(
  select('select with null option', { a: 1, b: null }, null, groupId)
);

expectKnobOfType<string | string[]>(
  select(
    'select with string and string array options',
    {
      Red: 'red',
      Blue: 'blue',
      Yellow: 'yellow',
      Rainbow: ['red', 'orange', 'etc'],
      None: 'transparent',
    },
    'red'
  )
);

expectKnobOfType<number | number[]>(
  select(
    'select with number and number array options',
    {
      Red: 1,
      Blue: 2,
      Yellow: 3,
      Rainbow: [4, 5, 6],
      None: 7,
    },
    7
  )
);

expectKnobOfType<string | string[] | null>(
  select(
    'select with string, string array, and null options',
    {
      Red: 'red',
      Blue: 'blue',
      Yellow: 'yellow',
      Rainbow: ['red', 'orange', 'etc'],
      None: null,
    },
    null
  )
);

expectKnobOfType<number[]>(
  select(
    'select with number array options',
    {
      ones: [1],
      twos: [2, 2],
      threes: [3, 3, 3],
    },
    [1]
  )
);

/** Object knob */

expectKnobOfType(
  object('object simple', {
    fontFamily: 'Arial',
    padding: 20,
  }),
  object('object with group', {}, groupId)
);

/** Options knob */

type Tool = 'hammer' | 'saw' | 'drill';
const visibleToolOptions: Record<string, Tool> = {
  hammer: 'hammer',
  saw: 'saw',
  drill: 'drill',
};

expectKnobOfType(
  options<Tool>('options with single selection', visibleToolOptions, 'hammer', {
    display: 'check',
  }),
  options<Tool>('options with multi selection', visibleToolOptions, ['hammer', 'saw'], {
    display: 'inline-check',
  }),
  options<Tool>('options with readonly multi selection', visibleToolOptions, ['hammer'] as const, {
    display: 'radio',
  }),
  options('options with group', {}, '', { display: 'check' })
);

expectKnobOfType<number | null>(
  options('select with null option', { a: 1, b: null }, null, { display: 'check' })
);

expectKnobOfType<string | string[]>(
  options(
    'options with string and string array options',
    {
      Red: 'red',
      Blue: 'blue',
      Yellow: 'yellow',
      Rainbow: ['red', 'orange', 'etc'],
      None: 'transparent',
    },
    'red',
    { display: 'check' }
  )
);

expectKnobOfType<number | number[]>(
  options(
    'select with number and number array options',
    {
      Red: 1,
      Blue: 2,
      Yellow: 3,
      Rainbow: [4, 5, 6],
      None: 7,
    },
    7,
    { display: 'check' }
  )
);

expectKnobOfType<string | string[] | null>(
  options(
    'select with string, string array, and null options',
    {
      Red: 'red',
      Blue: 'blue',
      Yellow: 'yellow',
      Rainbow: ['red', 'orange', 'etc'],
      None: null,
    },
    null,
    { display: 'check' }
  )
);

expectKnobOfType<number[]>(
  options(
    'select with number array options',
    {
      ones: [1],
      twos: [2, 2],
      threes: [3, 3, 3],
    },
    [1],
    { display: 'check' }
  )
);

/** Array knob */

const arrayReadonly = array('array as readonly', ['hi', 'there'] as const);

expectKnobOfType<string[]>(
  array('array simple', ['red', 'green', 'blue']),
  arrayReadonly,
  array('array with group', [], ',', groupId)
);

// Should return a mutable array despite the readonly input
arrayReadonly.push('Make sure that the output is still mutable although the input need not be!');

/** Button knob */

expectKnobOfType(
  button('button simple', () => {}),
  button('button with group', () => undefined, groupId)
);

/** Files knob */

expectKnobOfType<string[]>(
  files('files simple', 'image/*', []),
  files('files with group', 'image/*', ['img.jpg'], groupId)
);

/** Generic knob */

expectKnobOfType<string>(
  knob('generic knob as text', { type: 'text', value: 'a' }),
  knob('generic knob as color', { type: 'color', value: 'black' }),
  knob<'select', string>('generic knob as string select', {
    type: 'select',
    value: 'yes',
    options: ['yes', 'no'],
    selectV2: true,
  })
);

expectKnobOfType<number>(
  knob('generic knob as number', { type: 'number', value: 42 }),
  knob('generic knob as select', { type: 'radios', value: 3, options: { 3: 3, 7: 7, 23: 23 } }),
  knob('generic knob as number select', {
    type: 'select',
    value: 1,
    options: [1, 2],
    selectV2: true,
  })
);
