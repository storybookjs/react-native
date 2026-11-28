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

const actionPanels = () =>
  Object.values(addons.getElements(types.PANEL)).filter(
    (panel) => panel.id === 'storybook/actions/panel'
  );

describe('built-in actions with the @storybook/addon-ondevice-actions stub', () => {
  it('leaves exactly one Actions panel and warns once in development', () => {
    addons.setChannel(new Channel({}));
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // What `import '@storybook/addon-ondevice-actions/register'` does in storybook.requires,
    // which runs before `start()` registers the built-in addon.
    const stub = require('../../../ondevice-actions/src');
    stub.register();
    stub.register();
    expect(addons.experimental_getRegisteredAddons()).not.toContain('storybook/actions');

    require('./register').registerActionsAddon();
    addons.loadAddons({} as any);

    const panels = actionPanels();
    expect(panels).toHaveLength(1);
    expect(panels[0].title).toBe('Actions');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('built into @storybook/react-native')
    );

    warn.mockRestore();
  });
});
