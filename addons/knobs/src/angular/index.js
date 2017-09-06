import { prepareComponent } from './helpers.ts';

export const angularHandler = (channel, knobStore) => getStory => context =>
  prepareComponent({ getStory, context, channel, knobStore });
