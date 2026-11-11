import { theme, ThemeProvider } from '@storybook/react-native-theming';
import { LayoutProvider, StorageProvider } from '@storybook/react-native-ui-common';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SET_CURRENT_STORY } from 'storybook/internal/core-events';
import type { API_IndexHash } from 'storybook/internal/types';
import { Layout } from './Layout';
import { mockDataset } from './mockdata';

const mockEmit = jest.fn();

jest.mock('storybook/manager-api', () => ({
  addons: {
    getChannel: () => ({ emit: mockEmit }),
    getElements: () => ({}),
  },
}));

const mockSetMobileMenuOpen = jest.fn();

// Record what the layout asks of the drawer. Like the real one, which keeps its content mounted
// while closed, this renders the story list straight away.
jest.mock('./MobileMenuDrawer', () => {
  const React = require('react');

  return {
    MobileMenuDrawer: React.forwardRef(function MobileMenuDrawer({ children }, ref) {
      React.useImperativeHandle(ref, () => ({ setMobileMenuOpen: mockSetMobileMenuOpen }));

      return children;
    }),
  };
});

const storage = {
  getItem: async () => null,
  setItem: async () => {},
};

const renderUI = async () => {
  await render(
    <ThemeProvider theme={theme}>
      <StorageProvider storage={storage}>
        <LayoutProvider>
          <Layout storyHash={mockDataset.withRoot as API_IndexHash}>
            <Text>Story content</Text>
          </Layout>
        </LayoutProvider>
      </StorageProvider>
    </ThemeProvider>
  );
};

describe('Layout', () => {
  it('closes the mobile story list once a story is selected, but not when a group is toggled', async () => {
    await renderUI();

    await fireEvent.press(screen.getByText('Group 1'), { preventDefault: jest.fn() });

    expect(mockEmit).not.toHaveBeenCalled();
    expect(mockSetMobileMenuOpen).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByText('Child B1'));

    expect(mockEmit).toHaveBeenCalledWith(SET_CURRENT_STORY, { storyId: 'group-1--child-b1' });
    expect(mockSetMobileMenuOpen).toHaveBeenCalledTimes(1);
    expect(mockSetMobileMenuOpen).toHaveBeenCalledWith(false);
  });
});
