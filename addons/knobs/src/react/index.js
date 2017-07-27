import React from 'react';
import WrapStory from './WrapStory';

/**
 * Handles a react story
 */
export const reactHandler = (channel, knobStore) => getStory => context => {
  const initialContent = getStory(context);
  const props = { context, storyFn: getStory, channel, knobStore, initialContent };
  return <WrapStory {...props} />;
};
