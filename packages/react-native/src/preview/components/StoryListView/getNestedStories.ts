import { StoryIndex, StoryIndexEntry } from '@storybook/client-api';

export interface StoryGroup {
  name: string;
  title: string;
  children: StoryGroup[];
  stories: StoryIndexEntry[];
}

// recursive funciton that transforms storyIndex to be StoryGroup[]
export function getNestedStories(storyIndex: StoryIndex) {
  const stories = Object.values(storyIndex.stories);

  const group: StoryGroup[] = [];

  stories.forEach((story) => {
    const nameParts = story.title.split('/');
    formGroup(nameParts, story, group);
  });

  return group;
}

function formGroup(nameParts: string[], story: StoryIndexEntry, group: StoryGroup[]) {
  if (nameParts.length === 1) {
    const current = group.find(({ name }) => name === nameParts[0]);
    if (current) {
      current.stories.push(story);
    } else {
      group.push({
        title: story.title,
        name: nameParts[0],
        children: [],
        stories: [story],
      });
    }
    return;
  }

  const newParts = nameParts.slice(1);

  const currentListPart = group.find(({ name }) => name === nameParts[0]);

  if (!currentListPart) {
    const toPush: StoryGroup = {
      name: nameParts[0],
      title: story.title,
      children: [],
      stories: [],
    };

    group.push(toPush);

    return formGroup(newParts, story, toPush.children);
  } else if (!currentListPart.children) {
    currentListPart.children = [];
  }

  const newGroup = currentListPart.children;

  return formGroup(newParts, story, newGroup);
}

export const filterNestedStories = (stories: StoryGroup[], filter: string) => {
  const filteredStories: StoryGroup[] = [];

  stories.forEach((story) => {
    const filtered = filterStoryGroup(story, filter);
    if (filtered) {
      filteredStories.push(filtered);
    }
  });

  return filteredStories;
};

const filterStoryGroup = (story: StoryGroup, filter: string) => {
  const filteredStories = story.stories.filter(
    (item) =>
      item.title.toLowerCase().includes(filter.toLowerCase()) ||
      item.name.toLowerCase().includes(filter.toLowerCase())
  );

  const filteredChildren = filterNestedStories(story.children, filter);

  if (filteredStories.length || filteredChildren.length) {
    return {
      ...story,
      children: filteredChildren,
      stories: filteredStories,
    };
  }
};
