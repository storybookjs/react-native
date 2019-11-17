import React, { useContext, FunctionComponent } from 'react';
import { DocsContext } from './DocsContext';
import { DocsStory } from './DocsStory';
import { Heading } from './Heading';
import { StoriesSlot, DocsStoryProps } from './types';

interface StoriesProps {
  slot?: StoriesSlot;
  title?: JSX.Element | string;
}

export const Stories: FunctionComponent<StoriesProps> = ({ slot, title }) => {
  const context = useContext(DocsContext);
  const { storyStore, selectedKind } = context;
  const componentStories = storyStore
    .getStoriesForKind(selectedKind)
    .filter((s: any) => !(s.parameters && s.parameters.docs && s.parameters.docs.disable));

  const stories: DocsStoryProps[] = slot
    ? slot(componentStories, context)
    : componentStories && componentStories.slice(1);
  if (!stories) {
    return null;
  }
  return (
    <>
      <Heading>{title}</Heading>
      {stories.map(story => story && <DocsStory key={story.id} {...story} expanded />)}
    </>
  );
};

Stories.defaultProps = {
  title: 'Stories',
};
