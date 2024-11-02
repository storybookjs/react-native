import type { StoryObj, Meta } from '@storybook/react';
import { StorybookLogo } from './StorybookLogo';
import { useTheme } from '@storybook/react-native-theming';

const meta = {
  component: StorybookLogo,
  title: 'UI/StorybookLogo',
  args: {
    theme: null,
  },
} satisfies Meta<typeof StorybookLogo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TitleLogo: Story = {
  decorators: [
    (Story) => {
      const theme = useTheme();
      return <Story args={{ theme: { ...theme, brand: { title: 'React Native' } } }} />;
    },
  ],
};

export const ImageLogo: Story = {
  decorators: [
    (Story) => {
      const theme = useTheme();
      return (
        <Story
          args={{
            theme: { ...theme, brand: { image: 'https://reactnative.dev/img/oss_logo.svg' } },
          }}
        />
      );
    },
  ],
};

export const ImageUrlLogo: Story = {
  decorators: [
    (Story) => {
      const theme = useTheme();
      return (
        <Story
          args={{
            theme: {
              ...theme,
              brand: {
                image: 'https://reactnative.dev/img/oss_logo.svg',
                url: 'https://reactnative.dev',
              },
            },
          }}
        />
      );
    },
  ],
};

export const ImageSourceLogo: Story = {
  decorators: [
    (Story) => {
      const theme = useTheme();
      return (
        <Story
          args={{
            theme: {
              ...theme,
              brand: {
                imageSource: require('./assets/react-native-logo.png'),
                url: 'https://reactnative.dev',
              },
            },
          }}
        />
      );
    },
  ],
};
