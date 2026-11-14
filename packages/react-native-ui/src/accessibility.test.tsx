import type { ReactRenderer } from '@storybook/react';
import { theme, ThemeProvider } from '@storybook/react-native-theming';
import { LayoutProvider, StorageProvider } from '@storybook/react-native-ui-common';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Dimensions, Platform, Text } from 'react-native';
import type { Args, StoryContext } from 'storybook/internal/csf';
import type { API_IndexHash } from 'storybook/internal/types';
import { Layout } from './Layout';
import { mockDataset } from './mockdata';
import { StorybookLogo } from './StorybookLogo';

// Assistive tech and UI automation tools such as Appium find controls by role and label, so
// these tests query the rendered UI the way they do.
// @see https://github.com/storybookjs/react-native/issues/153

jest.mock('storybook/manager-api', () => ({
  addons: {
    getChannel: () => ({ emit: jest.fn() }),
    // One panel, so the layout renders its addons panel buttons.
    getElements: () => ({ 'storybook/test-panel': { title: 'Test', render: () => null } }),
  },
}));

// Like the real drawer, which keeps its content mounted while closed, render the story list
// straight away.
jest.mock('./MobileMenuDrawer', () => {
  const React = require('react');

  return {
    MobileMenuDrawer: React.forwardRef(function MobileMenuDrawer({ children }, ref) {
      React.useImperativeHandle(ref, () => ({ setMobileMenuOpen: jest.fn() }));

      return children;
    }),
  };
});

jest.mock('./MobileAddonsPanel', () => {
  const React = require('react');

  return {
    AddonsTabs: () => null,
    MobileAddonsPanel: React.forwardRef(function MobileAddonsPanel(_props, ref) {
      React.useImperativeHandle(ref, () => ({ setAddonsPanelOpen: jest.fn() }));

      return null;
    }),
  };
});

const storage = {
  getItem: async () => null,
  setItem: async () => {},
};

const story = {
  id: 'group-1--child-b1',
  title: 'Group 1',
  name: 'Child B1',
  parameters: {},
} as StoryContext<ReactRenderer, Args>;

const renderUI = async ({ withStory = true } = {}) => {
  await render(
    <ThemeProvider theme={theme}>
      <StorageProvider storage={storage}>
        <LayoutProvider>
          <Layout
            storyHash={mockDataset.withRoot as API_IndexHash}
            story={withStory ? story : undefined}
          >
            <Text>Story content</Text>
          </Layout>
        </LayoutProvider>
      </StorageProvider>
    </ThemeProvider>
  );
};

const setWindowWidth = async (width: number) => {
  const size = { width, height: 800, scale: 2, fontScale: 1 };

  await act(async () => {
    Dimensions.set({ window: size, screen: size });
  });
};

describe('on-device UI accessibility', () => {
  describe('on mobile', () => {
    it('labels the navigation bar buttons', async () => {
      await renderUI();

      expect(screen.getByRole('button', { name: 'Open story list' })).toBeOnTheScreen();
      expect(screen.getByRole('button', { name: 'Open addons panel' })).toBeOnTheScreen();
    });

    it('exposes the open story as the story list button value on iOS', async () => {
      await renderUI();

      expect(
        screen.getByRole('button', { name: 'Open story list', value: { text: 'Group 1/Child B1' } })
      ).toBeOnTheScreen();
    });

    it('sets no story list button value on Android, which appends it to the label', async () => {
      jest.replaceProperty(Platform, 'OS', 'android');

      try {
        await renderUI();

        const button = screen.getByRole('button', { name: 'Open story list' });

        expect(button.props.accessibilityValue?.text).toBeUndefined();
      } finally {
        jest.restoreAllMocks();
      }
    });

    it('sets no story list button value when no story is open', async () => {
      await renderUI({ withStory: false });

      const button = screen.getByRole('button', { name: 'Open story list' });

      expect(button.props.accessibilityValue?.text).toBeUndefined();
    });

    it('labels the fullscreen button with what pressing it does', async () => {
      await renderUI();

      await fireEvent.press(screen.getByRole('button', { name: 'Enter fullscreen' }));

      expect(screen.getByRole('button', { name: 'Exit fullscreen' })).toBeOnTheScreen();
      expect(screen.queryByRole('button', { name: 'Open story list' })).toBeNull();
    });

    it('exposes the story list rows as buttons and marks the selected story', async () => {
      await renderUI();

      expect(screen.getByRole('button', { name: 'Group 1' })).toBeOnTheScreen();
      expect(screen.getByRole('button', { name: 'Child A1' })).toBeOnTheScreen();
      expect(screen.getByRole('button', { name: 'Child B1', selected: true })).toBeOnTheScreen();
      expect(screen.getByRole('button', { name: 'Child B2', selected: false })).toBeOnTheScreen();
    });

    it('labels the expand all button with what pressing it does', async () => {
      await renderUI();

      // The roots start expanded but their components don't, so each button expands everything.
      const expandButtons = screen.getAllByRole('button', { name: 'Expand all' });
      expect(screen.queryByRole('button', { name: 'Collapse all' })).toBeNull();

      await fireEvent.press(expandButtons[0], { preventDefault: jest.fn() });

      expect(screen.getAllByRole('button', { name: 'Collapse all' })).toHaveLength(1);
      expect(screen.queryAllByRole('button', { name: 'Expand all' })).toHaveLength(
        expandButtons.length - 1
      );
    });

    it('labels the search field, its clear button and the results', async () => {
      await renderUI();

      const search = screen.getByLabelText('Find components');
      await fireEvent(search, 'focus');
      await fireEvent.changeText(search, 'Child B2');

      expect(await screen.findByRole('button', { name: 'Child B2, Group 1' })).toBeOnTheScreen();

      await fireEvent.press(screen.getByRole('button', { name: 'Clear search' }));

      expect(screen.queryByRole('button', { name: 'Child B2, Group 1' })).toBeNull();
    });
  });

  describe('on desktop', () => {
    const { width } = Dimensions.get('window');

    beforeEach(() => setWindowWidth(1200));
    afterEach(() => setWindowWidth(width));

    it('labels the sidebar toggle with what pressing it does', async () => {
      await renderUI();

      await fireEvent.press(screen.getByRole('button', { name: 'Close sidebar' }));

      expect(screen.getByRole('button', { name: 'Open sidebar' })).toBeOnTheScreen();
      expect(screen.queryByRole('button', { name: 'Close sidebar' })).toBeNull();
    });
  });
});

describe('StorybookLogo', () => {
  it('exposes a brand image that links somewhere as a labelled link', async () => {
    await render(
      <StorybookLogo
        theme={{
          ...theme,
          brand: {
            title: 'My design system',
            url: 'https://example.com',
            image: { uri: 'https://example.com/logo.png', width: 125, height: 25 },
          },
        }}
      />
    );

    expect(screen.getByRole('link', { name: 'My design system' })).toBeOnTheScreen();
  });

  it('exposes a brand title that links somewhere as a link', async () => {
    await render(
      <StorybookLogo
        theme={{ ...theme, brand: { title: 'My design system', url: 'https://example.com' } }}
      />
    );

    expect(screen.getByRole('link', { name: 'My design system' })).toBeOnTheScreen();
  });
});
