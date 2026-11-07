import { addons, types } from 'storybook/manager-api';

import { start } from '../Start';
import { ADDON_ID } from './constants';

type Store = typeof addons & {
  loaders: Record<string, unknown>;
  elements: Record<string, Record<string, unknown>>;
};
const store = addons as unknown as Store;

const startStorybook = () => start({ annotations: [], storyEntries: [] });

const controlsPanels = () =>
  Object.values(addons.getElements(types.PANEL)).filter((panel) => panel.id === ADDON_ID);

beforeEach(() => {
  delete store.loaders[ADDON_ID];
  delete store.elements[types.PANEL]?.[ADDON_ID];
});

afterEach(() => {
  globalThis.FEATURES = undefined;
  jest.restoreAllMocks();
});

test('registers the built-in Controls panel by default', () => {
  globalThis.FEATURES = {};
  startStorybook();

  expect(addons.experimental_getRegisteredAddons()).toContain(ADDON_ID);
});

test('does not register it when features.ondeviceControls is false', () => {
  globalThis.FEATURES = { ondeviceControls: false };
  startStorybook();

  expect(addons.experimental_getRegisteredAddons()).not.toContain(ADDON_ID);
});

test('the @storybook/addon-ondevice-controls stub leaves exactly one Controls panel', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  // storybook.requires imports the deviceAddons (here, the stub) before calling start().
  const stub = require('../../../ondevice-controls/src/index');
  stub.register();
  stub.register();

  globalThis.FEATURES = {};
  startStorybook();
  addons.loadAddons({ store: () => ({}) } as any);

  const panels = controlsPanels();
  expect(panels).toHaveLength(1);
  expect(panels[0].title).toBe('Controls');
  expect(stub.ADDON_ID).toBe(ADDON_ID);

  expect(warn).toHaveBeenCalledTimes(1);
  expect(warn.mock.calls[0][0]).toContain('@storybook/addon-ondevice-controls is no longer needed');
});
