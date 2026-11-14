import { type Args, type InputType, includeConditionalArg } from 'storybook/internal/csf';

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
    return includeConditionalArg(argType as InputType, args, {});
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

export interface ControlSection {
  ungrouped: ArgType[];
  subsections: Record<string, ArgType[]>;
}

export interface ControlSections {
  ungrouped: ArgType[];
  ungroupedSubsections: Record<string, ArgType[]>;
  sections: Record<string, ControlSection>;
}

/**
 * Category and subcategory names are arbitrary strings, so the records keyed by them have no
 * prototype: a group called `constructor`, `toString` or `__proto__` must not resolve to a property
 * inherited from `Object.prototype`.
 */
function createRecord<T>(): Record<string, T> {
  return Object.create(null);
}

/**
 * Groups the panel's rows (from `getControlArgTypes`) by `table.category` and `table.subcategory`,
 * the same way the web Controls panel does:
 *
 * - rows without a category or subcategory come first, ungrouped
 * - rows with only a subcategory are grouped into subsections at the top level
 * - rows with a category are grouped into a section, and within it into subsections when they also
 *   have a subcategory
 *
 * Rows, sections and subsections keep the order in which they first appear in the argTypes.
 */
export function groupControlArgTypes(args: ArgTypes): ControlSections {
  const groups: ControlSections = {
    ungrouped: [],
    ungroupedSubsections: createRecord(),
    sections: createRecord(),
  };

  Object.values(args ?? {}).forEach((row) => {
    const { category, subcategory } = row?.table ?? {};

    if (category) {
      const section = groups.sections[category] ?? { ungrouped: [], subsections: createRecord() };

      if (subcategory) {
        const subsection = section.subsections[subcategory] ?? [];
        subsection.push(row);
        section.subsections[subcategory] = subsection;
      } else {
        section.ungrouped.push(row);
      }

      groups.sections[category] = section;
    } else if (subcategory) {
      const subsection = groups.ungroupedSubsections[subcategory] ?? [];
      subsection.push(row);
      groups.ungroupedSubsections[subcategory] = subsection;
    } else {
      groups.ungrouped.push(row);
    }
  });

  return groups;
}

export type SectionLevel = 'section' | 'subsection';

export type FormRow =
  | { kind: 'arg'; arg: ArgType }
  | { kind: 'section'; id: string; label: string; level: SectionLevel; itemCount: number };

/**
 * Lays out the grouped args as the flat list of rows the panel renders: ungrouped args, then
 * subsections without a category, then each category with its own ungrouped args and subsections.
 * Each section and subsection gets a header row with a stable `id`; the args of a group whose id is
 * collapsed are left out.
 */
export function getFormRows(args: ArgTypes, collapsed: Record<string, boolean>): FormRow[] {
  const { ungrouped, ungroupedSubsections, sections } = groupControlArgTypes(args);
  const rows: FormRow[] = [];

  const addArgs = (groupArgs: ArgType[]) => {
    groupArgs.forEach((arg) => rows.push({ kind: 'arg', arg }));
  };

  const addSubsections = (subsections: Record<string, ArgType[]>, category?: string) => {
    Object.entries(subsections).forEach(([subcategory, subsectionArgs]) => {
      const id = JSON.stringify([category ?? null, subcategory]);

      rows.push({
        kind: 'section',
        id,
        label: subcategory,
        level: 'subsection',
        itemCount: subsectionArgs.length,
      });

      if (!collapsed[id]) {
        addArgs(subsectionArgs);
      }
    });
  };

  addArgs(ungrouped);
  addSubsections(ungroupedSubsections);

  Object.entries(sections).forEach(([category, section]) => {
    const id = JSON.stringify([category]);

    rows.push({
      kind: 'section',
      id,
      label: category,
      level: 'section',
      itemCount:
        section.ungrouped.length +
        Object.values(section.subsections).reduce((count, sub) => count + sub.length, 0),
    });

    if (!collapsed[id]) {
      addArgs(section.ungrouped);
      addSubsections(section.subsections, category);
    }
  });

  return rows;
}
