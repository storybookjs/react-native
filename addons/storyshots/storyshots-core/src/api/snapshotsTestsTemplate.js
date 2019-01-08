import { describe, it } from 'global';
import { addSerializer } from 'jest-specific-snapshot';

function snapshotTest({ item, asyncJest, framework, testMethod, testMethodParams }) {
  const { name } = item;
  const context = { ...item, framework };

  if (asyncJest === true) {
    it(name, done =>
      testMethod({
        done,
        story: item,
        context,
        ...testMethodParams,
      })
    );
  } else {
    it(name, () =>
      testMethod({
        story: item,
        context,
        ...testMethodParams,
      })
    );
  }
}

function snapshotTestSuite({ item, suite, ...restParams }) {
  const { kind, children } = item;
  describe(suite, () => {
    describe(kind, () => {
      children.forEach(c => {
        snapshotTest({ item: c, ...restParams });
      });
    });
  });
}

function snapshotsTests({ data, snapshotSerializers, ...restParams }) {
  if (snapshotSerializers) {
    snapshotSerializers.forEach(serializer => {
      addSerializer(serializer);
      expect.addSnapshotSerializer(serializer);
    });
  }

  data.forEach(item => {
    snapshotTestSuite({ item, ...restParams });
  });
}

export default snapshotsTests;
