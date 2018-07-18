import deprecate from 'util-deprecate';

import {
  knob,
  text,
  boolean,
  number,
  color,
  object,
  array,
  date,
  select,
  files,
  button,
  withKnobs as commonWithKnobs,
  withKnobsOptions as commonWithKnobsOptions,
} from '.';

export { knob, text, boolean, number, color, object, array, date, select, files, button };

export const selectV2 = deprecate(select, 'selectV2 has been renamed to select');

export const withKnobs = deprecate(
  commonWithKnobs,
  "addon-knobs: framework-specific imports are deprecated, just use `import {withKnobs} from '@storybook/addon-knobs`"
);

export const withKnobsOptions = deprecate(
  commonWithKnobsOptions,
  "addon-knobs: framework-specific imports are deprecated, just use `import {withKnobsOptions} from '@storybook/addon-knobs`"
);
