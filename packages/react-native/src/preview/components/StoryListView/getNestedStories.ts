import { StoryIndex, StoryIndexEntry } from '@storybook/client-api';

export interface StoryGroup {
  name: string;
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
    const toPush = {
      name: nameParts[0],
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
