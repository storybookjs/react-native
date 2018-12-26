/* eslint-disable jest/valid-describe */
import { describe, it } from 'global';
import { addSerializer } from 'jest-specific-snapshot';

function snapshotTest({
  asyncJest,
  story,
  kind,
  fileName,
  framework,
  testMethod,
  testMethodParams,
}) {
  const { name } = story;
  const context = { fileName, kind, story: name, framework };

  if (asyncJest === true) {
    it(name, done =>
      testMethod({
        done,
        story,
        context,
        ...testMethodParams,
      })
    );
  } else {
    it(name, () =>
      testMethod({
        story,
        context,
        ...testMethodParams,
      })
    );
  }
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

function snapshotsTests({ groups, storyKindRegex, snapshotSerializers, ...restParams }) {
  if (snapshotSerializers) {
    snapshotSerializers.forEach(serializer => {
      addSerializer(serializer);
      expect.addSnapshotSerializer(serializer);
    });
  }

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
