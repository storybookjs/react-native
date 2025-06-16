import type { StoryObj, Meta } from '@storybook/react';
import { StorybookLogo } from './StorybookLogo';
import { Theme, theme } from '@storybook/react-native-theming';
import { Text } from 'react-native';
import { decorators } from './decorators';

const meta = {
  component: StorybookLogo,
  title: 'UI/StorybookLogo',
  args: {
    theme: null,
  },
  decorators,
} satisfies Meta<typeof StorybookLogo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TitleLogo: Story = {
  args: {
    theme: {
      ...theme,
      brand: { title: 'React Native' },
    } satisfies Theme,
  },
};

export const ImageLogo: Story = {
  args: {
    theme: {
      ...theme,
      brand: {
        image: {
          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png',
          height: 25,
          width: 25,
        },
      },
    } satisfies Theme,
  },
};

export const ImageUrlLogo: Story = {
  args: {
    theme: {
      ...theme,
      brand: {
        image: {
          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png',
          width: 25,
          height: 25,
        },
        title: 'React Native',
        url: 'https://reactnative.dev',
      },
    } satisfies Theme,
  },
};

export const ImageSourceLogo: Story = {
  args: {
    theme: {
      ...theme,
      brand: {
        image: require('./assets/react-native-logo.png'),
        resizeMode: 'contain',
        url: 'https://reactnative.dev',
      },
    } satisfies Theme,
  },
};

export const ImageElementLogo: Story = {
  args: {
    theme: { ...theme, brand: { image: <Text>Element</Text> } } satisfies Theme,
  },
};
