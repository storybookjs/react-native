import { Movie } from './Object';
import preview from '../../../.rnstorybook/preview';

const meta = preview.meta({
  component: Movie,
  args: {
    filmInfo: {
      releaseYear: 1982,
      title: 'Blade Runner',
      genre: 'Sci Fi',
    },
  },
});

export default meta;

export const Basic = meta.story({});
