import { composeStories } from '@storybook/react';
import {
  type FormRow,
  getControlArgTypes,
  getFormRows,
  groupControlArgTypes,
} from '@storybook/addon-ondevice-controls/dist/controlArgTypes';
import * as GroupedControlsStories from './GroupedControls.stories';

const { Basic } = composeStories(GroupedControlsStories);

const controlRows = () => getControlArgTypes(Basic.argTypes, Basic.args);

const names = (args: { name?: string }[]) => args.map((arg) => arg.name);

const describeRows = (rows: FormRow[]) =>
  rows.map((row) => (row.kind === 'arg' ? row.arg.name : `${row.level}: ${row.label}`));

test('groups controls by table.category and table.subcategory', () => {
  const { ungrouped, ungroupedSubsections, sections } = groupControlArgTypes(controlRows());

  expect(names(ungrouped)).toEqual(['label', 'disabled']);
  expect(Object.keys(ungroupedSubsections)).toEqual(['Accessibility']);
  expect(names(ungroupedSubsections.Accessibility)).toEqual(['accessibilityLabel']);

  expect(Object.keys(sections)).toEqual(['Text', 'Appearance']);
  expect(names(sections.Text.ungrouped)).toEqual(['fontSize', 'bold']);
  expect(sections.Text.subsections).toEqual({});
  expect(sections.Appearance.ungrouped).toEqual([]);
  expect(Object.keys(sections.Appearance.subsections)).toEqual(['Colors', 'Shape']);
  expect(names(sections.Appearance.subsections.Colors)).toEqual(['backgroundColor', 'borderColor']);
  expect(names(sections.Appearance.subsections.Shape)).toEqual(['borderRadius']);
});

test('lays out ungrouped controls first, then subsections, then sections', () => {
  expect(describeRows(getFormRows(controlRows(), {}))).toEqual([
    'label',
    'disabled',
    'subsection: Accessibility',
    'accessibilityLabel',
    'section: Text',
    'fontSize',
    'bold',
    'section: Appearance',
    'subsection: Colors',
    'backgroundColor',
    'borderColor',
    'subsection: Shape',
    'borderRadius',
  ]);
});

test('counts every control in a section, including its subsections', () => {
  const headers = getFormRows(controlRows(), {}).filter((row) => row.kind === 'section');

  expect(headers.map((row) => [row.label, row.itemCount])).toEqual([
    ['Accessibility', 1],
    ['Text', 2],
    ['Appearance', 3],
    ['Colors', 2],
    ['Shape', 1],
  ]);
});

test('hides the controls of collapsed sections and subsections but keeps their headers', () => {
  const rows = getFormRows(controlRows(), {});
  const idOf = (label: string) =>
    rows.flatMap((row) => (row.kind === 'section' && row.label === label ? [row.id] : []))[0];

  expect(
    describeRows(getFormRows(controlRows(), { [idOf('Text')]: true, [idOf('Colors')]: true }))
  ).toEqual([
    'label',
    'disabled',
    'subsection: Accessibility',
    'accessibilityLabel',
    'section: Text',
    'section: Appearance',
    'subsection: Colors',
    'subsection: Shape',
    'borderRadius',
  ]);

  expect(describeRows(getFormRows(controlRows(), { [idOf('Appearance')]: true }))).toEqual([
    'label',
    'disabled',
    'subsection: Accessibility',
    'accessibilityLabel',
    'section: Text',
    'fontSize',
    'bold',
    'section: Appearance',
  ]);
});

test('subsections with the same name in different sections collapse independently', () => {
  const rows = getFormRows(
    {
      a: {
        name: 'a',
        control: { type: 'text' },
        table: { category: 'One', subcategory: 'Shared' },
      },
      b: {
        name: 'b',
        control: { type: 'text' },
        table: { category: 'Two', subcategory: 'Shared' },
      },
      c: { name: 'c', control: { type: 'text' }, table: { subcategory: 'Shared' } },
    },
    {}
  );
  const ids = rows.filter((row) => row.kind === 'section').map((row) => row.id);

  expect(new Set(ids).size).toBe(ids.length);
});

test('categories and subcategories can use names of Object.prototype properties', () => {
  const rows = getFormRows(
    {
      a: { name: 'a', control: { type: 'text' }, table: { category: 'constructor' } },
      b: {
        name: 'b',
        control: { type: 'text' },
        table: { category: 'constructor', subcategory: 'toString' },
      },
      c: { name: 'c', control: { type: 'text' }, table: { subcategory: '__proto__' } },
    },
    {}
  );

  expect(describeRows(rows)).toEqual([
    'subsection: __proto__',
    'c',
    'section: constructor',
    'a',
    'subsection: toString',
    'b',
  ]);
});

test('a story without categories is laid out as a flat list', () => {
  const rows = getFormRows(
    {
      a: { name: 'a', control: { type: 'text' } },
      b: { name: 'b', control: { type: 'boolean' } },
    },
    {}
  );

  expect(describeRows(rows)).toEqual(['a', 'b']);
});
