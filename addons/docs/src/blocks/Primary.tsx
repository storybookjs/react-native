import React, { useContext, FunctionComponent } from 'react';
import { DocsContext } from './DocsContext';
import { DocsStory } from './DocsStory';
import { StorySlot } from './types';

interface PrimaryProps {
  slot?: StorySlot;
}

export const Primary: FunctionComponent<PrimaryProps> = ({ slot }) => {
  const context = useContext(DocsContext);
  const { storyStore, selectedKind } = context;
  const componentStories = storyStore
    .getStoriesForKind(selectedKind)
    .filter((s: any) => !(s.parameters && s.parameters.docs && s.parameters.docs.disable));
  const story = slot ? slot(componentStories, context) : componentStories && componentStories[0];
  return story ? <DocsStory {...story} expanded={false} withToolbar /> : null;
};
