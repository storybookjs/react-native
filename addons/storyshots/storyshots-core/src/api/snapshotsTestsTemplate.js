import { describe, it } from 'global';

function snapshotTest({ story, kind, fileName, framework, testMethod, testMethodParams }) {
  const { name } = story;

  it(name, () => {
    const context = { fileName, kind, story: name, framework };

    return testMethod({
      story,
      context,
      ...testMethodParams,
    });
  });
}

function snapshotTestSuite({ kind, stories, suite, storyNameRegex, ...restParams }) {
  describe(suite, () => {
    describe(kind, () => {
      // eslint-disable-next-line
      for (const story of stories) {
        if (storyNameRegex && !story.name.match(storyNameRegex)) {
          // eslint-disable-next-line
          continue;
        }

        snapshotTest({ story, kind, ...restParams });
      }
    });
  });
}

function snapshotsTests({ groups, storyKindRegex, ...restParams }) {
  // eslint-disable-next-line
  for (const group of groups) {
    const { fileName, kind, stories } = group;

    if (storyKindRegex && !kind.match(storyKindRegex)) {
      // eslint-disable-next-line
      continue;
    }

    snapshotTestSuite({ stories, kind, fileName, ...restParams });
  }
}

export default snapshotsTests;
