import type { Meta, StoryObj } from '@storybook/react-native';
import { ThemedCard, AppThemeProvider, ThemeName } from './ThemedCard';

/**
 * This decorator reads the current backgrounds global and maps it to a theme.
 * When you switch the background in the Backgrounds panel, the card theme updates too.
 */
const withAppTheme: Meta<typeof ThemedCard>['decorators'] = [
  (Story, { globals }) => {
    const backgroundKey = globals.backgrounds?.value as string | undefined;

    // Map background keys to theme names
    const themeName: ThemeName = backgroundKey === 'dark' ? 'dark' : 'light';

    return (
      <AppThemeProvider name={themeName}>
        <Story />
      </AppThemeProvider>
    );
  },
];

const meta = {
  title: 'BackgroundExample/ThemedCard',
  component: ThemedCard,
  decorators: withAppTheme,
  args: {
    title: 'Themed Card',
    description:
      'This card adapts its colors based on the backgrounds global. Switch the background in the Backgrounds panel to see the card theme change.',
  },
} satisfies Meta<typeof ThemedCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkLocked: Story = {
  globals: {
    backgrounds: { value: 'dark' },
  },
  args: {
    title: 'Dark Theme Locked',
    description:
      'This story locks the background to dark via globals, so the card always uses the dark theme.',
  },
};
