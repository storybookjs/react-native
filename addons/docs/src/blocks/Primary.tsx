import React, { useContext, FunctionComponent } from 'react';
import { DocsContext } from './DocsContext';
import { DocsStory } from './DocsStory';
import { getDocsStories } from './utils';
import { StorySlot } from './shared';

interface PrimaryProps {
  slot?: StorySlot;
}

export const Primary: FunctionComponent<PrimaryProps> = ({ slot }) => {
  const context = useContext(DocsContext);
  const componentStories = getDocsStories(context);
  const story = slot ? slot(componentStories, context) : componentStories && componentStories[0];
  return story ? <DocsStory {...story} expanded={false} withToolbar /> : null;
};
