import type { StoryObj, Meta } from '@storybook/react-native';
import { Movie } from './Object';

const meta = {
  component: Movie,
  args: {
    filmInfo: {
      releaseYear: 1982,
      title: 'Blade Runner',
      genre: 'Sci Fi',
    },
  },
} satisfies Meta<typeof Movie>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
