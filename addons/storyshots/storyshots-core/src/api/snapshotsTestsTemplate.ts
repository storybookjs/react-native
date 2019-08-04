import { describe, it } from 'global';
import { addSerializer } from 'jest-specific-snapshot';

function snapshotTest({ item, asyncJest, framework, testMethod, testMethodParams }: any) {
  const { name } = item;
  const context = { ...item, framework };

  if (asyncJest === true) {
    it(name, (done: any) =>
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

function snapshotTestSuite({ item, suite, ...restParams }: any) {
  const { kind, children } = item;
  // eslint-disable-next-line jest/valid-describe
  describe(suite, () => {
    // eslint-disable-next-line jest/valid-describe
    describe(kind, () => {
      children.forEach((c: any) => {
        snapshotTest({ item: c, ...restParams });
      });
    });
  });
}

function snapshotsTests({ data, snapshotSerializers, ...restParams }: any) {
  if (snapshotSerializers) {
    snapshotSerializers.forEach((serializer: any) => {
      addSerializer(serializer);
      expect.addSnapshotSerializer(serializer);
    });
  }

  data.forEach((item: any) => {
    snapshotTestSuite({ item, ...restParams });
  });
}

export default snapshotsTests;
