import { addons, types } from 'storybook/manager-api';

import { ADDON_ID, registerControlsAddon } from './register';

type Store = typeof addons & { loaders: Record<string, (api: unknown) => void> };
const store = addons as Store;

afterEach(() => {
  delete store.loaders[ADDON_ID];
  jest.restoreAllMocks();
});

test('replaces the controls package registered under the same id, with a single panel', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const packageLoader = jest.fn(() => {
    addons.add(ADDON_ID, { type: types.PANEL, title: 'Package controls', render: () => null });
  });

  // `@storybook/addon-ondevice-controls/register` runs first, when storybook.requires is imported.
  addons.register(ADDON_ID, packageLoader);
  registerControlsAddon();

  addons.loadAddons({ store: () => ({}) } as any);

  expect(packageLoader).not.toHaveBeenCalled();
  const panels = Object.values(addons.getElements(types.PANEL)).filter(
    (panel) => panel.id === ADDON_ID
  );
  expect(panels).toHaveLength(1);
  expect(panels[0].title).toBe('Controls');
  // Our own hint, not the addon store's "loaded twice" warning.
  expect(warn).toHaveBeenCalledTimes(1);
  expect(warn.mock.calls[0][0]).toContain('features.ondeviceControls is enabled');
});

test('registers without a warning when the package is not used', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  registerControlsAddon();

  expect(addons.experimental_getRegisteredAddons()).toContain(ADDON_ID);
  expect(warn).not.toHaveBeenCalled();
});
