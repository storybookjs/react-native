/* eslint import/prefer-default-export: 0 */

export function filterStorybook(storybook, grep) {
  if (!grep || grep.length === 0) {
    return storybook;
  }

  const filteredStorybook = [];
  for (const group of storybook) {
    const re = new RegExp(grep);
    if (re.test(group.kind)) {
      filteredStorybook.push(group);
      continue;
    }

    const filteredGroup = {
      kind: group.kind,
      stories: [],
    };

    for (const story of group.stories) {
      if (re.test(story.name)) {
        filteredGroup.stories.push(story);
        continue;
      }
    }

    if (filteredGroup.stories.length > 0) {
      filteredStorybook.push(filteredGroup);
    }
  }

  return filteredStorybook;
}
