import React, { useContext, FunctionComponent } from 'react';
import { DocsContext } from './DocsContext';
import { DocsStory } from './DocsStory';
import { Heading } from './Heading';
import { getDocsStories } from './utils';
import { StoriesSlot, DocsStoryProps } from './shared';

interface StoriesProps {
  slot?: StoriesSlot;
  title?: JSX.Element | string;
}

export const Stories: FunctionComponent<StoriesProps> = ({ slot, title }) => {
  const context = useContext(DocsContext);
  const componentStories = getDocsStories(context);

  const stories: DocsStoryProps[] = slot
    ? slot(componentStories, context)
    : componentStories && componentStories.slice(1);
  if (!stories || stories.length === 0) {
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
