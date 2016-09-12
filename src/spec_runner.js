import snapshot from 'jest-snapshot';
import ReactTestRenderer from 'react-test-renderer';
import path from 'path';

const { jasmine, beforeEach, describe, it, expect } = global;

export default function runTests(storybook, {configDir, update, updateI}) {

  let snapshotState;
  let previousResult = {}

  function updateIfConfirmed(callback) {
    const currentSnapshot = snapshotState.snapshot;
    const cb = (yes) => {
      if(yes){
        currentSnapshot.add(previousResult.storyKey, previousResult.tree);
      }
      currentSnapshot.save(update);
      callback();
    }

    if(previousResult.faild && updateI){
      // If the test has failed and the user want to update interactively
      // ask user whether they want to update the story snapshot.
      confirmUpate(cb);
      previousResult.faild = false;
    } else {
      cb();
    }
  }

  describe('Snapshots of stories', () => {

    beforeAll(() => {
      const filePath = path.resolve(`${configDir}`, 'snapshots');
      snapshotState = snapshot.getSnapshotState(jasmine, filePath);
    });

    beforeEach(done => {
      const matcher = snapshot.matcher(
        process.cwd(),
        { updateSnapshot: update },
        snapshotState,
      );
      jasmine.addMatchers({
        toMatchSnapshot: matcher
      });

      updateIfConfirmed(done)
    }, 10000000);

    storybook.forEach(group => {
      describe(`${group.kind}`, () => {
        group.stories.forEach(story => {
          it(`${story.name}`, () => {
            const tree = story.render();
            const renderer = ReactTestRenderer.create(tree);
            const currentUnmatched = snapshotState.unmatched;
            expect(renderer.toJSON()).toMatchSnapshot();

            if (snapshotState.unmatched > currentUnmatched) {
              previousResult.faild = true;
              previousResult.tree = renderer.toJSON();
              const count = snapshotState.getCounter();
              previousResult.storyKey = snapshotState.getSpecName() + ' ' + count;
            }
          });
        });
      });
    });

    afterAll(function (done) {
      updateIfConfirmed(() => {
        done(); process.exit(0);
      });
    }, 10000000);
  });
}

function confirmUpate(callback) {
  process.stdout.write('\nReceived story is different from stored snapshot.\n');
  process.stdout.write('Should this story snapshot be updated?(y/n)');
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  const onKeypress = key => {
    switch (key) {
      case 'q':
        process.exit(0);
        break;
      case 'y':
        process.stdin.removeListener('data', onKeypress);
        process.stdout.write('\nUpdating the snapshot\n');
        process.stdin.setRawMode(false);
        callback(true)
        break;
      case 'n':
        process.stdin.removeListener('data', onKeypress);
        process.stdout.write('\nNot updating the snapshot\n');
        process.stdin.setRawMode(false);
        callback(false)
        break;
      default:
        process.stdout.write('\nPress either y or n\n');
    }
  }

  process.stdin.on('data', onKeypress);
}
