import type { StoryObj, Meta } from '@storybook/react';
import { Movie } from './Object';

const ObjectMeta: Meta<typeof Movie> = {
  title: 'ControlExamples/Object control',
  component: Movie,
  args: {
    filmInfo: {
      releaseYear: 1982,
      title: 'Blade Runner',
      genre: 'Sci Fi',
    },
  },
};

export default ObjectMeta;

type ObjectStory = StoryObj<typeof Movie>;

export const Basic: ObjectStory = {};
