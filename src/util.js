/* eslint import/prefer-default-export: 0 */

export function filterStorybook(storybook, grep, ignore) {
  if (!grep && !ignore) {
    // speed up for simple common case
    return storybook;
  }

  const grepRe = new RegExp(grep);
  const ignoreRe = new RegExp(ignore);

  const filter = (name) => {
    if (ignore && ignoreRe.test(name)) {
      return false;
    }

    return grepRe.test(name);
  };

  const filteredStorybook = [];

  storybook.forEach((group) => {
    if (ignore && ignoreRe.test(group.kind)) {
      return;
    }

    if (grep && grepRe.test(group.kind)) {
      filteredStorybook.push(group);
      return;
    }

    const filteredStories = group.stories.filter(story => (filter(story.name)));

    if (filteredStories.length === 0) {
      return;
    }

    const filteredGroup = {
      kind: group.kind,
      stories: filteredStories,
    };

    filteredStorybook.push(filteredGroup);
  });

  return filteredStorybook;
}
