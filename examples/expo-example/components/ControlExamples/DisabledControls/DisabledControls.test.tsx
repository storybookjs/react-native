import { composeStories } from '@storybook/react';
import { getControlArgTypes } from '@storybook/addon-ondevice-controls/dist/controlArgTypes';
import * as DisabledControlsStories from './DisabledControls.stories';

const { OnlyLabelEditable, AllDisabled } = composeStories(DisabledControlsStories);

test('only the label keeps an enabled control', () => {
  // `parameters.controls.exclude` is applied by core before the argTypes reach the panel.
  expect(Object.keys(OnlyLabelEditable.argTypes)).toEqual([
    'label',
    'controlFalse',
    'controlDisable',
    'tableDisable',
  ]);

  const rows = getControlArgTypes(OnlyLabelEditable.argTypes, OnlyLabelEditable.args);

  expect(Object.keys(rows)).toEqual(['label']);
  expect(rows.label).toMatchObject({ name: 'label', type: 'text', value: 'editable' });
});

test('a story with every control hidden has no rows', () => {
  const rows = getControlArgTypes(AllDisabled.argTypes, AllDisabled.args);

  expect(rows).toEqual({});
});
