import { type Args, includeConditionalArg } from 'storybook/internal/csf';

export interface ArgType {
  name?: string;
  description?: string;
  defaultValue?: any;
  [key: string]: any;
}

export interface ArgTypes {
  [key: string]: ArgType;
}

/**
 * Whether an argType has a control that should be shown in the panel.
 *
 * Storybook core supports three per-argType ways of hiding a control, which all need to be honored
 * here because core leaves the argType in place and only sets a flag on it:
 *
 * - `argTypes.foo.control = false`, which core normalizes to `control: { disable: true }`
 * - `argTypes.foo.control = { disable: true }`
 * - `argTypes.foo.table = { disable: true }`
 *
 * On web the `control` forms keep the row (with its description) and only drop the input, and only
 * `table.disable` removes the row. The on-device panel has no description column, so a row without
 * an input is just noise and all three forms hide the row.
 *
 * `parameters.controls.include` / `exclude` are applied by core's `inferControls` enhancer before
 * the argTypes reach the panel, so they need no handling here.
 */
export function hasEnabledControl(argType: ArgType | undefined): boolean {
  const control = argType?.control;

  if (!control || control.disable === true) {
    return false;
  }

  if (argType?.table?.disable === true) {
    return false;
  }

  return true;
}

function shouldIncludeArg(argType: ArgType, args: Args) {
  try {
    return includeConditionalArg(argType, args, {});
  } catch {
    return true;
  }
}

/**
 * Turns a story's argTypes into the rows the panel renders: only argTypes with an enabled control
 * whose `if` condition (if any) passes, each annotated with its name, control type and current value.
 */
export function getControlArgTypes(argTypes: ArgTypes, args: Args): ArgTypes {
  return Object.entries(argTypes ?? {}).reduce<ArgTypes>((prev, [key, argType]) => {
    if (!hasEnabledControl(argType) || !shouldIncludeArg(argType, args)) {
      return prev;
    }

    return {
      ...prev,
      [key]: {
        ...argType,
        name: key,
        type: argType.control.type,
        value: args[key],
      },
    };
  }, {});
}
