import { act, createElement } from 'react';
import { Channel } from 'storybook/internal/channels';
import { UPDATE_GLOBALS } from 'storybook/internal/core-events';
import { Addon_TypesEnum } from 'storybook/internal/types';
import { addons } from 'storybook/manager-api';
import { ThemeProvider, theme } from '@storybook/react-native-theming';
import { createRoot } from 'test-renderer';

import { withBackgrounds } from '../../../ondevice-backgrounds/src';
import { PANEL_ID } from './constants';
import { registerBackgroundsAddon } from './register';
import { resolveStoryBackgroundColor } from './utils';

// manager-api imports the web icon set, which ships untransformed ESM.
jest.mock('@storybook/icons', () => ({}));

declare const global: { __DEV__?: boolean; IS_REACT_ACT_ENVIRONMENT?: boolean };
global.IS_REACT_ACT_ENVIRONMENT = true;

const legacyParameters = {
  backgrounds: {
    default: 'Dark',
    values: [
      { name: 'Light', value: '#ffffff' },
      { name: 'Dark', value: '#333333' },
    ],
  },
};

describe('@storybook/addon-ondevice-backgrounds compatibility stub', () => {
  const story = {
    id: 'legacy--story',
    parameters: legacyParameters,
    globals: {},
    storyGlobals: {},
  };
  const plainStory = { id: 'plain--story', parameters: {}, globals: {}, storyGlobals: {} };
  let current: typeof story | typeof plainStory = story;
  const channel = new Channel({});
  const emit = jest.spyOn(channel, 'emit');
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  beforeAll(() => {
    addons.setChannel(channel);

    // What Start.tsx does by default, then the user's deviceAddons import of the stub.
    registerBackgroundsAddon();
    jest.isolateModules(() => {
      require('../../../ondevice-backgrounds/src/register');
      require('../../../ondevice-backgrounds/src/register');
    });

    addons.loadAddons({
      store: () => ({ fromId: () => current, getSelection: () => ({ storyId: current.id }) }),
    } as any);
  });

  afterAll(() => warn.mockRestore());

  it('registers exactly one Backgrounds panel', () => {
    const panels = Object.values(addons.getElements(Addon_TypesEnum.PANEL));
    const backgroundPanels = panels.filter((p: any) => p.title === 'Backgrounds');

    expect(backgroundPanels).toHaveLength(1);
    expect((backgroundPanels[0] as any).id).toBe(PANEL_ID);
  });

  it('warns once in development', () => {
    const calls = warn.mock.calls.filter(([msg]) =>
      String(msg).includes('@storybook/addon-ondevice-backgrounds')
    );
    expect(calls).toHaveLength(1);
    expect(calls[0][0]).toContain('built into @storybook/react-native');
  });

  it('withBackgrounds renders the story unchanged', () => {
    const rendered = { type: 'story' };
    const storyFn = jest.fn(() => rendered);

    expect((withBackgrounds as any)(storyFn, story)).toBe(rendered);
    expect(storyFn).toHaveBeenCalledTimes(1);
  });

  it('applies the legacy default as the story background', () => {
    expect(resolveStoryBackgroundColor(story)).toBe('#333333');
  });

  it('lists the legacy values in the panel and selects them by name', async () => {
    const panel = Object.values(addons.getElements(Addon_TypesEnum.PANEL)).find(
      (p: any) => p.id === PANEL_ID
    ) as any;

    const root = createRoot({ textComponentTypes: ['Text', 'RCTText'] });
    await act(async () => {
      root.render(
        createElement(ThemeProvider, { theme }, panel.render({ active: true, key: 'panel' }))
      );
    });

    const json = JSON.stringify(root.container.toJSON());
    expect(json).toContain('Light');
    expect(json).toContain('Dark');
    expect(json).not.toContain('Setup Instructions');

    const swatches = root.container.queryAll((node) => typeof node.props.onClick === 'function');
    expect(swatches).toHaveLength(2);
    await act(async () => {
      swatches.at(-1)!.props.onClick();
    });

    expect(emit).toHaveBeenCalledWith(UPDATE_GLOBALS, {
      globals: { backgrounds: { value: 'Dark' } },
    });
    expect(
      resolveStoryBackgroundColor({ ...story, globals: { backgrounds: { value: 'Light' } } })
    ).toBe('#ffffff');

    await act(async () => root.unmount());
  });

  it('leaves stories without backgrounds parameters unchanged', async () => {
    current = plainStory;
    expect(resolveStoryBackgroundColor(plainStory)).toBeUndefined();

    const panel = Object.values(addons.getElements(Addon_TypesEnum.PANEL)).find(
      (p: any) => p.id === PANEL_ID
    ) as any;
    const root = createRoot({ textComponentTypes: ['Text', 'RCTText'] });
    await act(async () => {
      root.render(
        createElement(ThemeProvider, { theme }, panel.render({ active: true, key: 'panel' }))
      );
    });

    // The panel shows setup instructions instead of swatches
    expect(JSON.stringify(root.container.toJSON())).toContain('Setup Instructions');
    await act(async () => root.unmount());
    current = story;
  });
});
