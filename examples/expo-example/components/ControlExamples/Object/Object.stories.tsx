import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { Movie } from './Object';

const ObjectMeta: ComponentMeta<typeof Movie> = {
  title: 'Object control',
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

type ObjectStory = ComponentStory<typeof Movie>;

export const Basic: ObjectStory = (args) => <Movie {...args} />;
