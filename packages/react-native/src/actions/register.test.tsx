import { addons, types } from 'storybook/manager-api';
import { Channel } from 'storybook/internal/channels';

// The real entry point pulls in `storybook/test`, which registers its own test hooks.
jest.mock('storybook/actions', () => ({
  ADDON_ID: 'storybook/actions',
  PANEL_ID: 'storybook/actions/panel',
  PARAM_KEY: 'actions',
  EVENT_ID: 'storybook/actions/action-event',
}));

jest.mock('./containers/ActionLogger', () => () => null);

const { registerActionsAddon } = require('./register');

describe('registerActionsAddon', () => {
  beforeEach(() => {
    addons.setChannel(new Channel({}));
  });

  it('replaces a loader registered by @storybook/addon-ondevice-actions under the same id', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const packageLoader = jest.fn(() => {
      addons.add('storybook/actions/panel', {
        type: types.PANEL,
        title: 'Actions (package)',
        render: () => null,
      });
    });
    // What `import '@storybook/addon-ondevice-actions/register'` does in storybook.requires.
    addons.register('storybook/actions', packageLoader);

    registerActionsAddon();
    addons.loadAddons({} as any);

    expect(packageLoader).not.toHaveBeenCalled();
    const panels = Object.values(addons.getElements(types.PANEL)).filter(
      (panel) => panel.id === 'storybook/actions/panel'
    );
    expect(panels).toHaveLength(1);
    expect(panels[0].title).toBe('Actions');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Remove it from deviceAddons'));

    warn.mockRestore();
  });
});
